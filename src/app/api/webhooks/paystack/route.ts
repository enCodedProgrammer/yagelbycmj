import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createReviewToken } from "@/lib/reviews";
import { sendOrderConfirmationEmail, sendReviewEmail, sendAdminOrderNotificationEmail } from "@/lib/emails";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== req.headers.get("x-paystack-signature")) {
    // A mismatch usually means PAYSTACK_SECRET_KEY differs from the one Paystack
    // signs with — log it so it isn't silently swallowed.
    console.error("[paystack] webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const data = event.data;
    const meta = data.metadata ?? {};
    const cartItems: { product_id: string; name: string; quantity: number; unit_price: number }[] =
      meta.cart_items ?? [];

    // Idempotency: Paystack may redeliver an event. If this reference is already
    // recorded, acknowledge and stop so we don't duplicate the order or emails.
    const { data: existing } = await getSupabaseAdmin()
      .from("orders")
      .select("id")
      .eq("payment_reference", data.reference)
      .maybeSingle();
    if (existing) {
      console.log("[paystack] order already processed for reference", data.reference);
      return NextResponse.json({ received: true });
    }

    const { data: order, error: orderError } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        customer_name: meta.customer_name,
        email: data.customer?.email,
        phone: meta.phone,
        address: meta.address,
        city: meta.city,
        postal_code: meta.postal_code,
        country: meta.country,
        payment_provider: "paystack",
        payment_reference: data.reference,
        total_amount: data.amount / 100, // kobo → naira
        currency: "NGN",
        status: "processing",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase order insert failed:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    if (cartItems.length > 0) {
      const { error: itemsError } = await getSupabaseAdmin()
        .from("order_items")
        .insert(
          cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }))
        );
      if (itemsError) {
        console.error("[paystack] order_items insert failed for order", order.id, itemsError);
      }

      const customerEmail = data.customer?.email;
      const customerName = meta.customer_name ?? "Customer";
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
      const proto = req.headers.get("x-forwarded-proto") || "https";
      const baseUrl = `${proto}://${host}`;

      // Emails/review tokens run after the order is safely persisted. Any failure
      // here must NOT fail the webhook — a 5xx would make Paystack retry and the
      // idempotency guard above would skip it, so the order would silently never
      // get its emails. Log loudly and still return 200.
      try {
        // 1. Order confirmation email — sent immediately.
        if (customerEmail) {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            name: customerName,
            items: cartItems.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unitPrice: i.unit_price,
            })),
            total: data.amount / 100,
            currency: "NGN",
            address: meta.address ?? "",
            city: meta.city ?? "",
            postalCode: meta.postal_code ?? "",
            country: meta.country ?? "",
            countryCode: meta.country_code ?? "",
            reference: data.reference,
          });
        }

        // 2. Admin notification — so the order can be processed/fulfilled.
        await sendAdminOrderNotificationEmail({
          to: customerEmail ?? "",
          name: customerName,
          items: cartItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unit_price,
          })),
          total: data.amount / 100,
          currency: "NGN",
          address: meta.address ?? "",
          city: meta.city ?? "",
          postalCode: meta.postal_code ?? "",
          country: meta.country ?? "",
          countryCode: meta.country_code ?? "",
          reference: data.reference,
          provider: "paystack",
          phone: meta.phone ?? "",
        });

        // 3. Review request — scheduled for 3 days after purchase.
        const reviewAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        for (const item of cartItems) {
          const token = await createReviewToken(
            order.id,
            item.product_id,
            item.name,
            customerName
          );
          if (customerEmail) {
            await sendReviewEmail(customerEmail, customerName, token, item.name, baseUrl, reviewAt);
          }
        }
      } catch (err) {
        console.error("[paystack] post-order emails failed for order", order.id, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
