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

export async function sendReviewEmail(
  to: string,
  name: string,
  token: string,
  productName: string,
  baseUrl: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[reviews] RESEND_API_KEY not set — skipping review email");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const link = `${baseUrl}/review/${token}`;
  const from = process.env.RESEND_FROM_EMAIL ?? "hello@yagelbycmj.com";

  const result = await resend.emails.send({
    from,
    to,
    subject: "How was your Yagel experience?",
    html: `
<!DOCTYPE html>
<html>
<body style="background:#111;color:#f5f0e8;font-family:Georgia,serif;margin:0;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;">
    <p style="letter-spacing:0.3em;font-size:10px;text-transform:uppercase;color:#c4a878;margin-bottom:32px;">
      Yagel Fragrance
    </p>
    <h1 style="font-size:28px;font-weight:400;letter-spacing:0.05em;margin-bottom:16px;">
      How was your experience?
    </h1>
    <p style="color:#aaa;line-height:1.7;margin-bottom:8px;">
      Dear ${name},
    </p>
    <p style="color:#aaa;line-height:1.7;margin-bottom:32px;">
      We hope you&rsquo;re enjoying your ${productName}. Your opinion means everything to us &mdash;
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
  </div>
</body>
</html>`,
  });
  if (result.error) {
    console.error("[reviews] sendReviewEmail failed:", result.error);
  } else {
    console.log("[reviews] review email sent to", to, "id:", result.data?.id);
  }
}
