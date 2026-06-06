import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
    unitPrice: number; // in the given currency
  }[];
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string; // e.g. "United Kingdom"
    countryCode: string; // e.g. "GB"
  };
}

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json();
  const { currency, items, customer } = body;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  if (currency === "NGN") {
    return handlePaystack(items, customer, baseUrl);
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
        },
      },
      quantity: item.quantity,
    })),
    customer_email: customer.email,
    metadata: {
      customer_name: customer.name,
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
  baseUrl: string
) {
  const totalKobo = items.reduce(
    (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
    0
  );

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
        address: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
        country: customer.country,
        country_code: customer.countryCode,
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
