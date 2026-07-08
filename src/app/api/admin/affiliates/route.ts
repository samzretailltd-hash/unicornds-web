import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { isAdmin } from "@/lib/affiliateAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const snap = await db.collection("affiliates").orderBy("createdAt", "desc").get();
  const affiliates = snap.docs.map((d) => {
    const a = d.data() as any;
    return {
      id: d.id, name: a.name, email: a.email, code: a.code, paypalEmail: a.paypalEmail,
      tier: a.tier || "standard",
      status: a.status, clicks: a.clicks || 0, conversions: a.conversions || 0,
      totalEarnings: a.totalEarnings || 0, pendingEarnings: a.pendingEarnings || 0,
      paidEarnings: a.paidEarnings || 0, createdAt: a.createdAt,
    };
  });

  const abSnap = await db.collection("abtests").get();
  const ab: Record<string, { impressions: number; conversions: number }> = {};
  abSnap.docs.forEach((d) => {
    const v = d.data() as any;
    const key = v.test + ":" + v.variant;
    if (!ab[key]) ab[key] = { impressions: 0, conversions: 0 };
    ab[key].impressions += v.impressions || 0;
    ab[key].conversions += v.conversions || 0;
  });

  return NextResponse.json({ affiliates, ab });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id, status, paypalEmail, tier } = await req.json();
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });
  const update: any = {};
  if (status) update.status = status;
  if (paypalEmail) update.paypalEmail = String(paypalEmail).trim().toLowerCase();
  if (tier && (tier === "standard" || tier === "selected")) update.tier = tier;
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  await db.collection("affiliates").doc(id).update(update);
  return NextResponse.json({ ok: true });
}
