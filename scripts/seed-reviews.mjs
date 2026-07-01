// One-off seed: insert real customer reviews into the `reviews` table.
//
// These reviews were collected outside the normal review-token flow, so they
// aren't tied to an order. We insert them directly with `submitted_at` set (so
// they display) and a `location` (Nigerian buyers: city only; abroad: city +
// country, e.g. "Glasgow, UK").
//
// Usage:
//   node scripts/seed-reviews.mjs          # dry run: print what would insert
//   node scripts/seed-reviews.mjs --send   # actually insert
//
// Requires (from .env.local): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// Requires the `location` column to exist first (Supabase SQL editor):
//   alter table reviews add column location text;

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const REVIEWS = [
  {
    product_id: "yagel-for-her",
    product_name: "Yagel For Her",
    reviewer_name: "Nifemi Peace Arikeade",
    rating: 5,
    location: "Ibadan",
    comment: `I used Yagel for her yesterday.

After bathing last night, I could still perceive it

Even this morning, the fragrance was still there

I was expecting a sugar, chocolate and the likes kind of fragrance..... You know how brand in Nigeria always want us to smell like sweet🤣🤣🤣🤣

Yagel is different!

No specific fragrance but it just announce itself that am here

No I can perceive something milk..... It's just stand alone and attractive.... And for staying long, I love it now

And my fiance couldn't stop talking about it....he was just like, I can still perceive this fragrance here ooo😂😂😂😂😂`,
  },
  {
    product_id: "yagel-for-him",
    product_name: "Yagel For Him",
    reviewer_name: "Ogunkanmi Feyisola Olamide",
    rating: 5,
    location: "Ibadan",
    comment: `I love the for him to the bones. The smell was all over where I went to yesterday`,
  },
  {
    product_id: "yagel-for-him",
    product_name: "Yagel For Him",
    reviewer_name: "Michael",
    rating: 5,
    location: "Ibadan",
    comment: `Thank you for giving YAGEL to the world!

The fragrance smells like I MADE IT OUT, or like MONEY IS NOTHING, or like ODOGWU WEY DEY PARA

I smell like I'M AS RICH AS No. 10 world richest man!

Let's make car versions too... immediately i applied it this morning, what came to my mind was imagining walking into an air conditioned car and that's the smell i meet, i'm going to want to stay in the car longer than i should😂😂`,
  },
];

async function main() {
  const send = process.argv.includes("--send");

  for (const r of REVIEWS) {
    // Skip if an identical review (same name + comment) already exists.
    const { data: existing, error: checkErr } = await supabase
      .from("reviews")
      .select("id")
      .eq("reviewer_name", r.reviewer_name)
      .eq("comment", r.comment)
      .maybeSingle();

    if (checkErr) {
      console.error(`Check failed for ${r.reviewer_name}:`, checkErr.message);
      continue;
    }
    if (existing) {
      console.log(`SKIP (already exists): ${r.reviewer_name}`);
      continue;
    }

    const row = {
      // These reviews aren't tied to a real order, but order_id is NOT NULL.
      // Use a synthetic UUID so the row is self-contained.
      order_id: crypto.randomUUID(),
      product_id: r.product_id,
      product_name: r.product_name,
      reviewer_name: r.reviewer_name,
      rating: r.rating,
      comment: r.comment,
      location: r.location,
      review_token: crypto.randomUUID(),
      submitted_at: new Date().toISOString(),
    };

    if (!send) {
      console.log(`DRY RUN would insert: ${r.reviewer_name} — ${r.product_name} — ${r.location} — ${r.rating}★`);
      continue;
    }

    const { error } = await supabase.from("reviews").insert(row);
    if (error) {
      console.error(`Insert failed for ${r.reviewer_name}:`, error.message);
    } else {
      console.log(`INSERTED: ${r.reviewer_name}`);
    }
  }

  if (!send) console.log("\nDry run complete. Re-run with --send to insert.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
