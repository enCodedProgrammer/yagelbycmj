import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createReviewToken, sendReviewEmail } from "@/lib/reviews";

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
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

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
        product_id: product?.id ?? "unknown",
        product_name: product?.name ?? li.description ?? "Product",
        quantity: li.quantity ?? 1,
        unit_price: (li.price?.unit_amount ?? 0) / 100,
      };
    });

    await getSupabaseAdmin().from("order_items").insert(orderItems);

    // Create a review token for each purchased product and send review email
    const customerEmail = session.customer_email;
    const customerName = meta.customer_name ?? "Customer";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${proto}://${host}`;

    for (const item of orderItems) {
      const token = await createReviewToken(
        order.id,
        item.product_id,
        item.product_name,
        customerName
      );
      if (customerEmail) {
        await sendReviewEmail(customerEmail, customerName, token, item.product_name, baseUrl);
      }
    }
  }

  return NextResponse.json({ received: true });
}
