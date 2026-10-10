import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { AFFILIATE_CONFIG } from "@/lib/affiliateConfig";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("ref");
  // Only allow same-site relative paths in `to` — never an absolute/off-site URL.
  // Prevents the referral link being abused as an open redirect to a phishing page.
  const rawTo = req.nextUrl.searchParams.get("to") || "/";
  const safeTo = (rawTo.startsWith("/") && !rawTo.startsWith("//")) ? rawTo : "/";
  const dest = new URL(safeTo, AFFILIATE_CONFIG.siteUrl);
  const res = NextResponse.redirect(dest);
  if (code) {
    res.cookies.set("aff_ref", code, {
      path: "/", maxAge: 60 * 60 * 24 * AFFILIATE_CONFIG.cookieDays, sameSite: "lax",
    });
    try {
      const snap = await db.collection("affiliates").where("code", "==", code).limit(1).get();
      if (!snap.empty) { await snap.docs[0].ref.update({ clicks: FieldValue.increment(1) }); }
    } catch {}
  }
  return res;
}
