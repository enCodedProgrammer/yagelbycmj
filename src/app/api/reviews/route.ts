import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  let query = getSupabase()
    .from("reviews")
    .select("id, product_id, product_name, reviewer_name, rating, comment, location, submitted_at")
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });

  if (product) {
    query = query.eq("product_id", product);
  }

  const { data, error } = await query.limit(20);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
