import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { commissionFor } from "@/lib/affiliateConfig";
import { FieldValue } from "firebase-admin/firestore";

// Call this from your Stripe webhook on EVERY successful payment
// (invoice.payment_succeeded) — first payment and every monthly renewal.
//
// Body: {
//   plan: "starter" | "growth" | "empire",
//   code?: string,                // affiliate code (from cookie/metadata) - needed on first payment
//   stripeCustomerId?: string,    // Stripe customer id - use this to resolve renewals
//   customerEmail?: string,
//   amount?: number,              // sale value, stored for reference only
//   orderId: string,              // Stripe invoice id - used to dedupe (unique per month)
//   secret: string
// }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, code, stripeCustomerId, customerEmail, amount, orderId, secret } = body;

    if (secret !== process.env.CONVERT_SECRET) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required (use the Stripe invoice id)." }, { status: 400 });
    }

    // dedupe: one commission per invoice
    const dup = await db.collection("conversions").where("orderId", "==", String(orderId)).limit(1).get();
    if (!dup.empty) return NextResponse.json({ ok: true, deduped: true });

    // resolve which affiliate referred this customer
    const refKey = stripeCustomerId ? String(stripeCustomerId) : (customerEmail ? String(customerEmail).toLowerCase() : null);
    let affId: string | null = null;
    let affCode: string | null = null;
    let refPlan: string | null = null;

    if (code) {
      const snap = await db.collection("affiliates").where("code", "==", String(code)).limit(1).get();
      if (snap.empty) return NextResponse.json({ error: "Unknown affiliate code." }, { status: 404 });
      affId = snap.docs[0].id;
      affCode = String(code);
    } else if (refKey) {
      const refDoc = await db.collection("referrals").doc(refKey).get();
      if (!refDoc.exists) return NextResponse.json({ error: "No referral on record for this customer." }, { status: 404 });
      const r = refDoc.data() as any;
      affId = r.affiliateId; affCode = r.code; refPlan = r.plan || null;
    } else {
      return NextResponse.json({ error: "Provide code (first payment) or stripeCustomerId/customerEmail (renewal)." }, { status: 400 });
    }

    const affSnap = await db.collection("affiliates").doc(affId!).get();
    if (!affSnap.exists) return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
    const aff = affSnap.data() as any;
    const tier = aff.tier || "standard";

    const usePlan = String(plan || refPlan || "").toLowerCase();
    const commission = commissionFor(usePlan, tier);
    if (commission <= 0) {
      return NextResponse.json({ error: "Unknown or non-paying plan: " + usePlan }, { status: 400 });
    }

    // store/refresh the customer -> affiliate mapping so future renewals resolve without a code
    if (refKey) {
      await db.collection("referrals").doc(refKey).set({
        affiliateId: affId, code: affCode, plan: usePlan, updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    await db.collection("conversions").add({
      affiliateId: affId, code: affCode, plan: usePlan, tier,
      customerEmail: customerEmail ? String(customerEmail).toLowerCase() : null,
      stripeCustomerId: stripeCustomerId ? String(stripeCustomerId) : null,
      amount: amount != null ? Number(amount) : null,
      commission, orderId: String(orderId),
      status: "pending", createdAt: new Date().toISOString(),
    });

    await affSnap.ref.update({
      conversions: FieldValue.increment(1),
      totalEarnings: FieldValue.increment(commission),
      pendingEarnings: FieldValue.increment(commission),
    });

    return NextResponse.json({ ok: true, plan: usePlan, tier, commission });
  } catch (e: any) {
    return NextResponse.json({ error: "Convert failed: " + (e?.message || "unknown") }, { status: 500 });
  }
}
