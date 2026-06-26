// Replays a Paystack charge.success event to our live webhook so an order that
// was paid for — but never recorded because the webhook URL was unset — gets
// backfilled (order row, order_items, confirmation email, scheduled review email).
//
// It fetches the real transaction from Paystack, rebuilds the exact event
// payload, signs it with PAYSTACK_SECRET_KEY (HMAC SHA512, same as Paystack),
// and POSTs it to the live webhook. The webhook's idempotency guard makes this
// safe to run repeatedly.
//
// Usage:
//   node scripts/replay-paystack.mjs --list            # show recent successful txns
//   node scripts/replay-paystack.mjs <reference>       # replay one transaction
//
// Requires PAYSTACK_SECRET_KEY (read from .env.local).

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- load .env.local (simple KEY=VALUE parser) ---
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

const SECRET = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_URL = "https://www.yagelbycmj.com/api/webhooks/paystack";

if (!SECRET) {
  console.error("Missing PAYSTACK_SECRET_KEY (checked .env.local and env).");
  process.exit(1);
}
if (!SECRET.startsWith("sk_live")) {
  console.warn(`WARNING: PAYSTACK_SECRET_KEY is "${SECRET.slice(0, 8)}…" — not a live key. A live charge won't be found/verifiable with a test key.`);
}

const paystack = (endpoint) =>
  fetch(`https://api.paystack.co${endpoint}`, {
    headers: { Authorization: `Bearer ${SECRET}` },
  }).then((r) => r.json());

async function list() {
  const res = await paystack("/transaction?status=success&perPage=20");
  if (!res.status) {
    console.error("Failed to list transactions:", res.message);
    process.exit(1);
  }
  console.log("Recent successful transactions:\n");
  for (const t of res.data) {
    console.log(
      `  ${t.reference}  ${t.currency} ${(t.amount / 100).toLocaleString()}  ${t.customer?.email ?? ""}  ${t.paid_at ?? t.created_at}`
    );
  }
  console.log("\nReplay one with:  node scripts/replay-paystack.mjs <reference>");
}

async function replay(reference) {
  const res = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
  if (!res.status) {
    console.error("Verify failed:", res.message);
    process.exit(1);
  }
  const txn = res.data;
  if (txn.status !== "success") {
    console.error(`Transaction status is "${txn.status}", not "success" — not replaying.`);
    process.exit(1);
  }

  console.log(
    `Replaying ${txn.reference}: ${txn.currency} ${(txn.amount / 100).toLocaleString()} for ${txn.customer?.email}`
  );
  const cartItems = txn.metadata?.cart_items ?? [];
  console.log(`  cart_items: ${cartItems.length} item(s)`);
  if (cartItems.length === 0) {
    console.warn("  WARNING: no cart_items in metadata — order will be created but with no items/emails.");
  }

  // Rebuild the event exactly as Paystack delivers it.
  const payload = JSON.stringify({ event: "charge.success", data: txn });
  const signature = crypto.createHmac("sha512", SECRET).update(payload).digest("hex");

  const hookRes = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": signature,
    },
    body: payload,
  });

  const text = await hookRes.text();
  console.log(`\nWebhook responded ${hookRes.status}: ${text}`);
  if (hookRes.ok) {
    console.log("Done. Check the orders table and Resend dashboard.");
  } else {
    console.error("Webhook did not return 200 — order may not have been created.");
    process.exit(1);
  }
}

const arg = process.argv[2];
if (!arg || arg === "--list" || arg === "-l") {
  await list();
} else {
  await replay(arg);
}
