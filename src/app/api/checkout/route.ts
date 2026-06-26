import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getNigerianDeliveryFee } from "@/lib/delivery";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export interface CheckoutBody {
  currency: "GBP" | "USD" | "NGN";
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryFee: number; // legacy, ignored — fee is computed server-side
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    state?: string;
    lagosArea?: string;
    country: string;
    countryCode: string;
  };
}

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json();
  const { currency, items, customer } = body;

  // Always derive the base URL from the request so redirects work on any
  // domain — avoids localhost leaking in when NEXT_PUBLIC_BASE_URL isn't
  // updated in the deployment environment.
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  if (currency === "NGN") {
    // Compute the fee server-side so the client can't tamper with it
    const deliveryFee = getNigerianDeliveryFee(
      customer.state ?? "",
      customer.lagosArea
    );
    if (deliveryFee === null) {
      return NextResponse.json(
        { error: "Please select your state and delivery area." },
        { status: 400 }
      );
    }
    return handlePaystack(items, customer, deliveryFee, baseUrl);
  }

  return handleStripe(currency, items, customer, baseUrl);
}

async function handleStripe(
  currency: "GBP" | "USD",
  items: CheckoutBody["items"],
  customer: CheckoutBody["customer"],
  baseUrl: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: Math.round(item.unitPrice * 100), // pence/cents
        product_data: {
          name: item.name,
          images: item.image.startsWith("http") ? [item.image] : [],
          // Carry the catalog id so the webhook can map line items back to our
          // products (Stripe otherwise generates its own prod_… id).
          metadata: { product_id: item.productId },
        },
      },
      quantity: item.quantity,
    })),
    customer_email: customer.email,
    metadata: {
      customer_name: customer.name,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postal_code: customer.postalCode,
      country: customer.country,
      country_code: customer.countryCode,
    },
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}

async function handlePaystack(
  items: CheckoutBody["items"],
  customer: CheckoutBody["customer"],
  deliveryFee: number,
  baseUrl: string
) {
  const itemsKobo = items.reduce(
    (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
    0
  );
  const totalKobo = itemsKobo + deliveryFee * 100;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: customer.email,
      amount: totalKobo,
      currency: "NGN",
      callback_url: `${baseUrl}/order/success`,
      metadata: {
        customer_name: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
        state: customer.state ?? "",
        lagos_area: customer.lagosArea ?? "",
        country: customer.country,
        country_code: customer.countryCode,
        delivery_fee: deliveryFee,
        cart_items: items.map((i) => ({
          product_id: i.productId,
          name: i.name,
          quantity: i.quantity,
          unit_price: i.unitPrice,
        })),
      },
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return NextResponse.json(
      { error: "Paystack initialization failed", details: data.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.data.authorization_url, reference: data.data.reference });
}
