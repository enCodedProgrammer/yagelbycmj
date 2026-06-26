import { countries, formatPrice } from "@/lib/data";

type Currency = "GBP" | "USD" | "NGN";

export interface EmailItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@yagelbycmj.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "thehouseofcmj@yagelbycmj.com";

// Lazily create a Resend client. Returns null (and warns) when the API key is
// missing so callers can no-op in environments where email isn't configured.
async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[emails] RESEND_API_KEY not set — skipping email");
    return null;
  }
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

const shell = (inner: string) => `
<!DOCTYPE html>
<html>
<body style="background:#111;color:#f5f0e8;font-family:Georgia,serif;margin:0;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;">
    <p style="letter-spacing:0.3em;font-size:10px;text-transform:uppercase;color:#c4a878;margin-bottom:32px;">
      Yagel Fragrance
    </p>
    ${inner}
  </div>
</body>
</html>`;

export interface OrderConfirmationArgs {
  to: string;
  name: string;
  items: EmailItem[];
  total: number;
  currency: Currency;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string;
  reference: string;
}

// Sent immediately after a successful payment — the first email the buyer gets.
export async function sendOrderConfirmationEmail(args: OrderConfirmationArgs): Promise<void> {
  const resend = await getResend();
  if (!resend) return;

  const {
    to, name, items, total, currency,
    address, city, postalCode, country, countryCode, reference,
  } = args;

  const shippingDays = countries.find((c) => c.code === countryCode)?.shippingDays;

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;color:#f5f0e8;">${item.name} <span style="color:#777;">&times; ${item.quantity}</span></td>
        <td style="padding:8px 0;text-align:right;color:#f5f0e8;">${formatPrice(item.unitPrice * item.quantity, currency)}</td>
      </tr>`
    )
    .join("");

  const html = shell(`
    <h1 style="font-size:28px;font-weight:400;letter-spacing:0.05em;margin-bottom:16px;">
      Order confirmed
    </h1>
    <p style="color:#aaa;line-height:1.7;margin-bottom:8px;">Dear ${name},</p>
    <p style="color:#aaa;line-height:1.7;margin-bottom:32px;">
      Thank you for your order. We&rsquo;re preparing your fragrance with care - here&rsquo;s a summary of your purchase.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;border-top:1px solid #333;color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Total</td>
        <td style="padding:14px 0 0;border-top:1px solid #333;text-align:right;color:#c4a878;font-size:16px;">${formatPrice(total, currency)}</td>
      </tr>
    </table>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-top:32px;margin-bottom:8px;">
      Delivery to
    </p>
    <p style="color:#aaa;line-height:1.7;margin:0;">
      ${name}<br>
      ${address}<br>
      ${city}${postalCode ? `, ${postalCode}` : ""}<br>
      ${country}
    </p>
    ${
      shippingDays
        ? `<p style="color:#aaa;line-height:1.7;margin-top:16px;">Estimated delivery: <span style="color:#f5f0e8;">${shippingDays} days</span>.</p>`
        : ""
    }

    <p style="color:#555;font-size:11px;margin-top:40px;line-height:1.6;">
      Order reference: ${reference}<br>
      If anything looks wrong, just reply to this email and we&rsquo;ll sort it out.
    </p>
  `);

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Yagel order is confirmed",
    html,
  });
  if (result.error) {
    console.error("[emails] sendOrderConfirmationEmail failed:", result.error);
  } else {
    console.log("[emails] order confirmation sent to", to, "id:", result.data?.id);
  }
}

export interface AdminOrderNotificationArgs extends OrderConfirmationArgs {
  provider: string; // "stripe" | "paystack"
  phone: string;
}

// Internal notification to the admin so they can process/fulfil the order.
// Contains every detail: customer, contact, shipping address, items, total.
// Sent for every order, regardless of country/provider.
export async function sendAdminOrderNotificationEmail(args: AdminOrderNotificationArgs): Promise<void> {
  const resend = await getResend();
  if (!resend) return;

  const {
    to: customerEmail, name, items, total, currency,
    address, city, postalCode, country, reference, provider, phone,
  } = args;

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;color:#f5f0e8;">${item.name} <span style="color:#777;">&times; ${item.quantity}</span></td>
        <td style="padding:8px 0;text-align:right;color:#f5f0e8;">${formatPrice(item.unitPrice * item.quantity, currency)}</td>
      </tr>`
    )
    .join("");

  const html = shell(`
    <h1 style="font-size:24px;font-weight:400;letter-spacing:0.05em;margin-bottom:8px;">
      New order - action needed
    </h1>
    <p style="color:#aaa;line-height:1.7;margin-bottom:32px;">
      A new order has been paid and is ready to process.
    </p>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-bottom:8px;">
      Items
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;border-top:1px solid #333;color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Total</td>
        <td style="padding:14px 0 0;border-top:1px solid #333;text-align:right;color:#c4a878;font-size:16px;">${formatPrice(total, currency)}</td>
      </tr>
    </table>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-top:32px;margin-bottom:8px;">
      Customer
    </p>
    <p style="color:#aaa;line-height:1.7;margin:0;">
      ${name}<br>
      ${customerEmail}${phone ? `<br>${phone}` : ""}
    </p>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-top:32px;margin-bottom:8px;">
      Ship to
    </p>
    <p style="color:#aaa;line-height:1.7;margin:0;">
      ${address}<br>
      ${city}${postalCode ? `, ${postalCode}` : ""}<br>
      ${country}
    </p>

    <p style="color:#555;font-size:11px;margin-top:40px;line-height:1.6;">
      Payment: ${provider} &middot; ${currency} ${formatPrice(total, currency)}<br>
      Reference: ${reference}
    </p>
  `);

  const result = await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `New order: ${name} - ${formatPrice(total, currency)}`,
    html,
  });
  if (result.error) {
    console.error("[emails] sendAdminOrderNotificationEmail failed:", result.error);
  } else {
    console.log("[emails] admin order notification sent to", ADMIN_EMAIL, "id:", result.data?.id);
  }
}

// Review request. Pass `scheduledAt` (ISO 8601) to have Resend deliver it later;
// omit it to send immediately.
export async function sendReviewEmail(
  to: string,
  name: string,
  token: string,
  productName: string,
  baseUrl: string,
  scheduledAt?: string
): Promise<void> {
  const resend = await getResend();
  if (!resend) return;

  const link = `${baseUrl}/review/${token}`;

  const html = shell(`
    <h1 style="font-size:28px;font-weight:400;letter-spacing:0.05em;margin-bottom:16px;">
      How was your experience?
    </h1>
    <p style="color:#aaa;line-height:1.7;margin-bottom:8px;">
      Dear ${name},
    </p>
    <p style="color:#aaa;line-height:1.7;margin-bottom:32px;">
      We hope you&rsquo;re enjoying your ${productName}. Your opinion means everything to us -
      a quick review takes 30 seconds and helps others discover their signature scent.
    </p>
    <a href="${link}"
       style="display:inline-block;background:#c4a878;color:#111;text-decoration:none;
              padding:14px 32px;letter-spacing:0.2em;font-size:12px;text-transform:uppercase;">
      Leave a Review
    </a>
    <p style="color:#555;font-size:11px;margin-top:40px;line-height:1.6;">
      This link is unique to your order and can only be used once.<br>
      If you have any issues, reply to this email.
    </p>
  `);

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "How was your Yagel experience?",
    html,
    ...(scheduledAt ? { scheduledAt } : {}),
  });
  if (result.error) {
    console.error("[emails] sendReviewEmail failed:", result.error);
  } else {
    console.log(
      "[emails] review email",
      scheduledAt ? `scheduled (${scheduledAt})` : "sent",
      "to",
      to,
      "id:",
      result.data?.id
    );
  }
}
