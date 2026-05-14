import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// GET: Fetch affiliate dashboard data
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // Find affiliate by email
    const affSnap = await adminDb.collection("affiliate_applications")
      .where("email", "==", decoded.email)
      .where("status", "==", "approved")
      .limit(1)
      .get();

    if (affSnap.empty) {
      return NextResponse.json({ error: "Not an approved affiliate", approved: false }, { status: 403 });
    }

    const affDoc = affSnap.docs[0];
    const affData = affDoc.data() as any;
    const affiliate = { id: affDoc.id, ...affData };
    const refCode = affData.ref_code || "";

    // Get all referrals
    const referralsSnap = await adminDb.collection("users")
      .where("ref", "==", refCode)
      .get();

    const referrals = referralsSnap.docs.map(d => {
      const data = d.data();
      return {
        email: data.email || "",
        tier: data.tier || "free",
        signed_up: data.created_at || "",
        status: data.status || "",
      };
    });

    // Get commissions
    const commissionsSnap = await adminDb.collection("affiliate_commissions")
      .where("affiliate_id", "==", affDoc.id)
      .orderBy("created_at", "desc")
      .limit(50)
      .get();

    const commissions = commissionsSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    const totalEarned = commissions.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
    const totalPaid = commissions.filter((c: any) => c.paid).reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
    const totalPending = totalEarned - totalPaid;

    // Get payouts
    const payoutsSnap = await adminDb.collection("affiliate_payouts")
      .where("affiliate_id", "==", affDoc.id)
      .orderBy("created_at", "desc")
      .limit(20)
      .get();

    const payouts = payoutsSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    // Get bank details
    const bankSnap = await adminDb.collection("affiliate_bank_details").doc(affDoc.id).get();
    const bankDetails = bankSnap.exists ? bankSnap.data() : null;

    return NextResponse.json({
      approved: true,
      affiliate: {
        name: affiliate.name,
        email: affiliate.email,
        ref_code: refCode,
        ref_link: `https://www.unicornds.io/signup?ref=${refCode}`,
        approved_at: affiliate.approved_at,
      },
      stats: {
        total_referrals: referrals.length,
        paid_referrals: referrals.filter(r => r.tier !== "free").length,
        free_referrals: referrals.filter(r => r.tier === "free").length,
        total_earned: Math.round(totalEarned * 100) / 100,
        total_paid: Math.round(totalPaid * 100) / 100,
        total_pending: Math.round(totalPending * 100) / 100,
        commission_rate: 30,
      },
      referrals,
      commissions,
      payouts,
      bank_details: bankDetails ? {
        has_details: true,
        bank_name: bankDetails.bank_name || "",
        account_name: bankDetails.account_name || "",
        sort_code: bankDetails.sort_code ? "****" + bankDetails.sort_code.slice(-2) : "",
        account_number: bankDetails.account_number ? "****" + bankDetails.account_number.slice(-4) : "",
      } : { has_details: false },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST: Save bank details or request payout
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const { action, bank_name, account_name, sort_code, account_number, iban } = await req.json();

    // Find affiliate
    const affSnap = await adminDb.collection("affiliate_applications")
      .where("email", "==", decoded.email)
      .where("status", "==", "approved")
      .limit(1)
      .get();

    if (affSnap.empty) {
      return NextResponse.json({ error: "Not an approved affiliate" }, { status: 403 });
    }

    const affDoc = affSnap.docs[0];
    const affData = affDoc.data() as any;

    if (action === "save_bank") {
      // Save bank details
      if (!bank_name || !account_name || (!account_number && !iban)) {
        return NextResponse.json({ error: "Missing bank details" }, { status: 400 });
      }

      await adminDb.collection("affiliate_bank_details").doc(affDoc.id).set({
        bank_name,
        account_name,
        sort_code: sort_code || "",
        account_number: account_number || "",
        iban: iban || "",
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({ ok: true, message: "Bank details saved" });
    }

    if (action === "request_payout") {
      // Check minimum payout (£25)
      const commissionsSnap = await adminDb.collection("affiliate_commissions")
        .where("affiliate_id", "==", affDoc.id)
        .where("paid", "==", false)
        .get();

      const unpaidTotal = commissionsSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);

      if (unpaidTotal < 25) {
        return NextResponse.json({ error: `Minimum payout is £25. You have £${unpaidTotal.toFixed(2)} pending.` }, { status: 400 });
      }

      // Check bank details exist
      const bankDoc = await adminDb.collection("affiliate_bank_details").doc(affDoc.id).get();
      if (!bankDoc.exists) {
        return NextResponse.json({ error: "Please add your bank details first" }, { status: 400 });
      }

      // Create payout request
      await adminDb.collection("affiliate_payouts").add({
        affiliate_id: affDoc.id,
        affiliate_email: affData.email,
        affiliate_name: affData.name,
        amount: Math.round(unpaidTotal * 100) / 100,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      // Send Telegram alert
      const { sendTelegram } = await import("@/lib/brevo");
      sendTelegram(
        `💰 <b>Payout Request!</b>\n👤 ${affData.name}\n📧 ${affData.email}\n💷 £${unpaidTotal.toFixed(2)}\n⏳ Pending admin approval`
      ).catch(() => {});

      return NextResponse.json({ ok: true, message: `Payout of £${unpaidTotal.toFixed(2)} requested. We'll process it within 5 business days.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
