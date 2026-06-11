import { NextRequest, NextResponse } from "next/server";
import { sendReviewEmail } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// DELETE THIS FILE after debugging is done
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "Pass ?to=your@email.com" }, { status: 400 });
  }

  const fakeToken = "test-token-" + Date.now();
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  try {
    await sendReviewEmail(to, "Test User", fakeToken, "Yagel For Her", baseUrl);
    return NextResponse.json({ ok: true, message: `Email attempted to ${to}`, baseUrl });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
