import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select("product_id, product_name, reviewer_name, submitted_at")
    .eq("review_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  return NextResponse.json({
    product_id: data.product_id,
    product_name: data.product_name,
    reviewer_name: data.reviewer_name ?? "",
    alreadySubmitted: !!data.submitted_at,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json();
  const { reviewer_name, rating, comment } = body ?? {};

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }
  if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  // Check token exists and not already submitted
  const { data: existing } = await getSupabase()
    .from("reviews")
    .select("submitted_at")
    .eq("review_token", token)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }
  if (existing.submitted_at) {
    return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  }

  const { error } = await getSupabaseAdmin()
    .from("reviews")
    .update({
      reviewer_name: reviewer_name?.trim() || "Anonymous",
      rating,
      comment: comment.trim(),
      submitted_at: new Date().toISOString(),
    })
    .eq("review_token", token);

  if (error) {
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
