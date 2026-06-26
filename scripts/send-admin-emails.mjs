// One-off backfill: send the admin order-notification email to the admin for
// orders that already exist in the table (they predate the admin-email feature).
//
// Reads orders + order_items from Supabase and sends one summary email per
// order to the admin. Mirrors sendAdminOrderNotificationEmail in src/lib/emails.ts.
//
// Usage:
//   node scripts/send-admin-emails.mjs            # dry run: list what would send
//   node scripts/send-admin-emails.mjs --send     # actually send
//   node scripts/send-admin-emails.mjs --send <reference> [<reference> ...]
//
// Requires (from .env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// RESEND_API_KEY. Optional: RESEND_FROM_EMAIL, ADMIN_NOTIFY_EMAIL.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv();

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@yagelbycmj.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "thehouseofcmj@yagelbycmj.com";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendKey = process.env.RESEND_API_KEY;

for (const [name, val] of [
  ["NEXT_PUBLIC_SUPABASE_URL", supabaseUrl],
  ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
  ["RESEND_API_KEY", resendKey],
]) {
  if (!val) {
    console.error(`Missing ${name} (checked .env.local and env).`);
    process.exit(1);
  }
}

const supabase = createClient(supabaseUrl, serviceKey);
const resend = new Resend(resendKey);

function formatPrice(amount, currency) {
  const locale = currency === "GBP" ? "en-GB" : currency === "USD" ? "en-US" : "en-NG";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount);
}

const shell = (inner) => `
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

function adminHtml(order, items) {
  const currency = order.currency;
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;color:#f5f0e8;">${i.product_name} <span style="color:#777;">&times; ${i.quantity}</span></td>
        <td style="padding:8px 0;text-align:right;color:#f5f0e8;">${formatPrice(i.unit_price * i.quantity, currency)}</td>
      </tr>`
    )
    .join("");

  return shell(`
    <h1 style="font-size:24px;font-weight:400;letter-spacing:0.05em;margin-bottom:8px;">
      New order - action needed
    </h1>
    <p style="color:#aaa;line-height:1.7;margin-bottom:32px;">
      A new order has been paid and is ready to process.
    </p>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-bottom:8px;">Items</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
      ${rows}
      <tr>
        <td style="padding:14px 0 0;border-top:1px solid #333;color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Total</td>
        <td style="padding:14px 0 0;border-top:1px solid #333;text-align:right;color:#c4a878;font-size:16px;">${formatPrice(order.total_amount, currency)}</td>
      </tr>
    </table>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-top:32px;margin-bottom:8px;">Customer</p>
    <p style="color:#aaa;line-height:1.7;margin:0;">${order.customer_name}<br>${order.email}${order.phone ? `<br>${order.phone}` : ""}</p>

    <p style="color:#c4a878;text-transform:uppercase;letter-spacing:0.15em;font-size:11px;margin-top:32px;margin-bottom:8px;">Ship to</p>
    <p style="color:#aaa;line-height:1.7;margin:0;">
      ${order.address ?? ""}<br>
      ${order.city ?? ""}${order.postal_code ? `, ${order.postal_code}` : ""}<br>
      ${order.country ?? ""}
    </p>

    <p style="color:#555;font-size:11px;margin-top:40px;line-height:1.6;">
      Payment: ${order.payment_provider} &middot; ${formatPrice(order.total_amount, currency)}<br>
      Reference: ${order.payment_reference}
    </p>
  `);
}

const args = process.argv.slice(2);
const send = args.includes("--send");
const refFilter = args.filter((a) => !a.startsWith("--"));

const { data: orders, error } = await supabase
  .from("orders")
  .select("*")
  .order("created_at", { ascending: true });

if (error) {
  console.error("Failed to read orders:", error.message);
  process.exit(1);
}

const selected = refFilter.length
  ? orders.filter((o) => refFilter.includes(o.payment_reference))
  : orders;

console.log(`${selected.length} order(s) ${send ? "to send" : "(dry run — pass --send to send)"}:\n`);

for (const order of selected) {
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  const itemList = items ?? [];
  console.log(
    `  ${order.payment_reference}  ${order.currency} ${order.total_amount}  ${order.customer_name} <${order.email}>  ${itemList.length} item(s)`
  );

  if (!send) continue;

  const result = await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: order.email,
    subject: `New order: ${order.customer_name} - ${formatPrice(order.total_amount, order.currency)}`,
    html: adminHtml(order, itemList),
  });
  if (result.error) {
    console.error(`    -> FAILED: ${JSON.stringify(result.error)}`);
  } else {
    console.log(`    -> sent to ${ADMIN_EMAIL} (id: ${result.data?.id})`);
  }
}

if (!send) console.log(`\nRe-run with --send to email these to ${ADMIN_EMAIL}.`);
