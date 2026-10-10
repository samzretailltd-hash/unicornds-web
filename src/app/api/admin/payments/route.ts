import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { isAdmin } from "@/lib/affiliateAuth";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    // `amount` is now an OPTIONAL cap. If omitted, pay the whole pending balance.
    // We only ever pay a whole number of pending conversions, and the amount we
    // deduct is ALWAYS the exact sum of the conversions we marked paid — so the
    // balance and the conversion records can never drift out of sync.
    const { affiliateId, amount, method, note } = await req.json();
    if (!affiliateId) {
      return NextResponse.json({ error: "affiliateId required." }, { status: 400 });
    }
    const cap = amount != null ? Number(amount) : Infinity;
    if (amount != null && (!(cap > 0))) {
      return NextResponse.json({ error: "amount must be a positive number." }, { status: 400 });
    }

    const affRef = db.collection("affiliates").doc(affiliateId);
    const affSnap = await affRef.get();
    if (!affSnap.exists) return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });

    const convSnap = await db.collection("conversions")
      .where("affiliateId", "==", affiliateId).where("status", "==", "pending")
      .orderBy("createdAt", "asc").get();

    // Greedily select oldest pending conversions that fully fit under the cap.
    const batch = db.batch();
    let paidSum = 0;
    let count = 0;
    for (const c of convSnap.docs) {
      const comm = Number((c.data() as any).commission) || 0;
      if (comm <= 0) continue;
      if (paidSum + comm > cap + 0.001) break; // never mark a conversion we aren't fully paying
      batch.update(c.ref, {
        status: "paid",
        paidAt: new Date().toISOString(),
      });
      paidSum += comm;
      count++;
    }
    paidSum = Math.round(paidSum * 100) / 100;

    if (count === 0) {
      return NextResponse.json({
        error: amount != null
          ? "No pending commission fits under that amount."
          : "Nothing pending to pay out.",
      }, { status: 400 });
    }

    await batch.commit();
    await db.collection("payments").add({
      affiliateId, amount: paidSum, conversionsPaid: count,
      method: method || "PayPal", note: note || "", createdAt: new Date().toISOString(),
    });
    // Deduct the EXACT amount we actually paid — not a free-form figure.
    await affRef.update({
      pendingEarnings: FieldValue.increment(-paidSum),
      paidEarnings: FieldValue.increment(paidSum),
    });
    return NextResponse.json({ ok: true, amountPaid: paidSum, conversionsPaid: count });
  } catch (e: any) {
    return NextResponse.json({ error: "Payout failed: " + (e?.message || "unknown") }, { status: 500 });
  }
}
