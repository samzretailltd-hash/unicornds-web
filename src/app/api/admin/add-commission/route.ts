import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const refCode = (body.ref_code || "").trim();
    const tier = (body.tier || "growth").trim();
    const paymentAmount = Number(body.payment_amount) || 0;
    const emails = Array.isArray(body.referred_emails)
      ? body.referred_emails.map((e) => e.trim().toLowerCase()).filter(Boolean) : [];
    if (!refCode || paymentAmount <= 0 || emails.length === 0)
      return NextResponse.json({ error: "ref_code, payment_amount and referred_emails are required" }, { status: 400 });

    const affSnap = await adminDb.collection("affiliate_applications")
      .where("ref_code", "==", refCode).where("status", "==", "approved").limit(1).get();
    if (affSnap.empty) return NextResponse.json({ error: `No approved affiliate for ${refCode}` }, { status: 404 });

    const affDoc = affSnap.docs[0];
    const aff = affDoc.data();
    const commissionRate = 0.30;
    const amount = Math.round(paymentAmount * commissionRate * 100) / 100;
    const added = [], skipped = [];

    for (const email of emails) {
      const dup = await adminDb.collection("affiliate_commissions")
        .where("affiliate_id", "==", affDoc.id).where("referred_email", "==", email).limit(1).get();
      if (!dup.empty) { skipped.push(email); continue; }
      await adminDb.collection("affiliate_commissions").add({
        affiliate_id: affDoc.id, affiliate_email: aff.email, affiliate_name: aff.name,
        referred_email: email, referred_tier: tier, payment_amount: paymentAmount,
        commission_rate: commissionRate, amount, paid: false,
        created_at: new Date().toISOString(), manual: true, added_by: admin.email,
      });
      added.push(email);
    }
    return NextResponse.json({ ok: true, affiliate: aff.name, per_commission: amount,
      added_count: added.length, skipped_count: skipped.length,
      total_added: Math.round(added.length * amount * 100) / 100, added, skipped });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
