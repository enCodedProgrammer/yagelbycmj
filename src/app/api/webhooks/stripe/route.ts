import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createReviewToken } from "@/lib/reviews";
import { sendOrderConfirmationEmail, sendReviewEmail, sendAdminOrderNotificationEmail } from "@/lib/emails";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // A signature failure usually means STRIPE_WEBHOOK_SECRET doesn't match the
    // endpoint's signing secret — log it loudly so it isn't silently swallowed.
    console.error("[stripe] webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    // Idempotency: Stripe may redeliver an event (e.g. after a previous 5xx).
    // If we've already recorded this session, acknowledge and stop so we don't
    // duplicate the order or re-send emails.
    const { data: existing } = await getSupabaseAdmin()
      .from("orders")
      .select("id")
      .eq("payment_reference", session.id)
      .maybeSingle();
    if (existing) {
      console.log("[stripe] order already processed for session", session.id);
      return NextResponse.json({ received: true });
    }

    const lineItemsRes = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const { data: order, error: orderError } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        customer_name: meta.customer_name,
        email: session.customer_email,
        address: meta.address,
        city: meta.city,
        postal_code: meta.postal_code,
        country: meta.country,
        payment_provider: "stripe",
        payment_reference: session.id,
        total_amount: (session.amount_total ?? 0) / 100,
        currency: session.currency?.toUpperCase(),
        status: "processing",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase order insert failed:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    const orderItems = lineItemsRes.data.map((li) => {
      const product = li.price?.product as Stripe.Product | undefined;
      return {
        order_id: order.id,
        // Prefer our catalog id (set in checkout metadata) so reviews map to the
        // right product page; fall back to Stripe's product id.
        product_id: product?.metadata?.product_id ?? product?.id ?? "unknown",
        product_name: product?.name ?? li.description ?? "Product",
        quantity: li.quantity ?? 1,
        unit_price: (li.price?.unit_amount ?? 0) / 100,
      };
    });

    const { error: itemsError } = await getSupabaseAdmin()
      .from("order_items")
      .insert(orderItems);
    if (itemsError) {
      console.error("[stripe] order_items insert failed for order", order.id, itemsError);
    }

    const customerEmail = session.customer_email;
    const customerName = meta.customer_name ?? "Customer";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${proto}://${host}`;

    // Emails/review tokens run after the order is safely persisted. Any failure
    // here must NOT fail the webhook — a 5xx would make Stripe retry and the
    // idempotency guard above would skip it, so the order would silently never
    // get its emails. Log loudly and still return 200.
    const emailItems = orderItems.map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    }));
    const emailTotal = (session.amount_total ?? 0) / 100;
    const emailCurrency = (session.currency?.toUpperCase() ?? "GBP") as "GBP" | "USD" | "NGN";

    try {
      // 1. Order confirmation email — sent immediately.
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          name: customerName,
          items: emailItems,
          total: emailTotal,
          currency: emailCurrency,
          address: meta.address ?? "",
          city: meta.city ?? "",
          postalCode: meta.postal_code ?? "",
          country: meta.country ?? "",
          countryCode: meta.country_code ?? "",
          reference: session.id,
        });
      }

      // 2. Admin notification — so the order can be processed/fulfilled.
      await sendAdminOrderNotificationEmail({
        to: customerEmail ?? "",
        name: customerName,
        items: emailItems,
        total: emailTotal,
        currency: emailCurrency,
        address: meta.address ?? "",
        city: meta.city ?? "",
        postalCode: meta.postal_code ?? "",
        country: meta.country ?? "",
        countryCode: meta.country_code ?? "",
        reference: session.id,
        provider: "stripe",
      });

      // 3. Review request — scheduled for 3 days after purchase.
      const reviewAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      for (const item of orderItems) {
        const token = await createReviewToken(
          order.id,
          item.product_id,
          item.product_name,
          customerName
        );
        if (customerEmail) {
          await sendReviewEmail(customerEmail, customerName, token, item.product_name, baseUrl, reviewAt);
        }
      }
    } catch (err) {
      console.error("[stripe] post-order emails failed for order", order.id, err);
    }
  }

  return NextResponse.json({ received: true });
}
