import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { isAdmin } from "@/lib/affiliateAuth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { affiliateId, amount, method, note } = await req.json();
    if (!affiliateId || !amount) {
      return NextResponse.json({ error: "affiliateId and amount required." }, { status: 400 });
    }
    const amt = Number(amount);
    const affRef = db.collection("affiliates").doc(affiliateId);
    const affSnap = await affRef.get();
    if (!affSnap.exists) return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
    const a = affSnap.data() as any;
    if (amt > (a.pendingEarnings || 0) + 0.001) {
      return NextResponse.json({ error: "Amount exceeds pending balance." }, { status: 400 });
    }
    const convSnap = await db.collection("conversions")
      .where("affiliateId", "==", affiliateId).where("status", "==", "pending")
      .orderBy("createdAt", "asc").get();
    let remaining = amt;
    const batch = db.batch();
    for (const c of convSnap.docs) {
      if (remaining <= 0.001) break;
      const cd = c.data() as any;
      batch.update(c.ref, { status: "paid" });
      remaining -= cd.commission || 0;
    }
    await batch.commit();
    await db.collection("payments").add({
      affiliateId, amount: amt, method: method || "PayPal",
      note: note || "", createdAt: new Date().toISOString(),
    });
    await affRef.update({
      pendingEarnings: FieldValue.increment(-amt),
      paidEarnings: FieldValue.increment(amt),
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Payout failed: " + (e?.message || "unknown") }, { status: 500 });
  }
}
