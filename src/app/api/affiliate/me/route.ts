import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { getAffiliate } from "@/lib/affiliateAuth";
import { AFFILIATE_CONFIG } from "@/lib/affiliateConfig";

export async function GET(req: NextRequest) {
  const auth = getAffiliate(req);
  if (!auth) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const docSnap = await db.collection("affiliates").doc(auth.id).get();
  if (!docSnap.exists) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  const a = docSnap.data() as any;
  const tier = a.tier || "standard";

  const convSnap = await db.collection("conversions")
    .where("affiliateId", "==", auth.id).orderBy("createdAt", "desc").limit(50).get();
  const conversions = convSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const paySnap = await db.collection("payments")
    .where("affiliateId", "==", auth.id).orderBy("createdAt", "desc").limit(50).get();
  const payments = paySnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  // this affiliate's rate per plan, based on their tier
  const rates: Record<string, number> = {};
  for (const plan of AFFILIATE_CONFIG.plans) {
    const p = AFFILIATE_CONFIG.commissions[plan];
    rates[plan] = tier === "selected" ? p.selected : p.standard;
  }

  return NextResponse.json({
    profile: { name: a.name, email: a.email, code: a.code, paypalEmail: a.paypalEmail, status: a.status, tier },
    stats: {
      clicks: a.clicks || 0, conversions: a.conversions || 0,
      totalEarnings: a.totalEarnings || 0, pendingEarnings: a.pendingEarnings || 0, paidEarnings: a.paidEarnings || 0,
    },
    conversions, payments,
    config: {
      minPayout: AFFILIATE_CONFIG.minPayout,
      currencySymbol: AFFILIATE_CONFIG.currencySymbol,
      siteUrl: AFFILIATE_CONFIG.siteUrl,
      plans: AFFILIATE_CONFIG.plans,
      rates,
    },
  });
}
