import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, verifyAdmin } from "@/lib/firebase-admin";
import { sendTelegram } from "@/lib/brevo";

// POST: Admin processes a payout
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const admin = verifyAdmin(decoded.email || "");
    if (!admin) return NextResponse.json({ error: "Not admin" }, { status: 403 });

    const { payout_id, action, reference } = await req.json();
    if (!payout_id || !action) return NextResponse.json({ error: "Missing payout_id or action" }, { status: 400 });

    const payoutRef = adminDb.collection("affiliate_payouts").doc(payout_id);
    const payoutDoc = await payoutRef.get();
    if (!payoutDoc.exists) return NextResponse.json({ error: "Payout not found" }, { status: 404 });

    const payout = payoutDoc.data()!;

    if (action === "approve") {
      // Mark payout as paid
      await payoutRef.update({
        status: "paid",
        paid_at: new Date().toISOString(),
        paid_by: decoded.email,
        bank_reference: reference || "",
      });

      // Mark all unpaid commissions for this affiliate as paid
      const commissionsSnap = await adminDb.collection("affiliate_commissions")
        .where("affiliate_id", "==", payout.affiliate_id)
        .where("paid", "==", false)
        .get();

      const batch = adminDb.batch();
      commissionsSnap.docs.forEach(doc => {
        batch.update(doc.ref, {
          paid: true,
          paid_at: new Date().toISOString(),
          payout_id: payout_id,
        });
      });
      await batch.commit();

      sendTelegram(
        `✅ <b>Payout Processed!</b>\n👤 ${payout.affiliate_name}\n💷 £${payout.amount?.toFixed(2)}\n🏦 Reference: ${reference || "—"}\n👨‍💼 By: ${decoded.email}`
      ).catch(() => {});

      return NextResponse.json({ ok: true, message: "Payout marked as paid" });
    }

    if (action === "reject") {
      await payoutRef.update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejected_by: decoded.email,
        reject_reason: reference || "Not specified",
      });

      sendTelegram(
        `❌ <b>Payout Rejected</b>\n👤 ${payout.affiliate_name}\n💷 £${payout.amount?.toFixed(2)}\n📝 Reason: ${reference || "—"}`
      ).catch(() => {});

      return NextResponse.json({ ok: true, message: "Payout rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
