import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createReviewToken, sendReviewEmail } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== req.headers.get("x-paystack-signature")) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const data = event.data;
    const meta = data.metadata ?? {};
    const cartItems: { product_id: string; name: string; quantity: number; unit_price: number }[] =
      meta.cart_items ?? [];

    const { data: order, error: orderError } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        customer_name: meta.customer_name,
        email: data.customer?.email,
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
      await getSupabaseAdmin().from("order_items").insert(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );

      // Create a review token per product and send review email
      const customerEmail = data.customer?.email;
      const customerName = meta.customer_name ?? "Customer";
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
      const proto = req.headers.get("x-forwarded-proto") || "https";
      const baseUrl = `${proto}://${host}`;

      for (const item of cartItems) {
        const token = await createReviewToken(
          order.id,
          item.product_id,
          item.name,
          customerName
        );
        if (customerEmail) {
          await sendReviewEmail(customerEmail, customerName, token, item.name, baseUrl);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
