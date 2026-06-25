import { getSupabaseAdmin } from "@/lib/supabase";

export async function createReviewToken(
  orderId: string,
  productId: string,
  productName: string,
  reviewerName: string
): Promise<string> {
  const token = crypto.randomUUID();
  const { error } = await getSupabaseAdmin().from("reviews").insert({
    order_id: orderId,
    product_id: productId,
    product_name: productName,
    reviewer_name: reviewerName,
    review_token: token,
  });
  if (error) console.error("[reviews] createReviewToken failed:", error);
  return token;
}
