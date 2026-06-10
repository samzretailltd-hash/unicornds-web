import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";

// One-time / on-demand: reconcile Firestore paid users against Stripe (source of truth).
// - Reconnects users who have a live Stripe subscription (writes sub id, status, period end, tier)
// - NEVER removes access; just reports users with no live Stripe subscription
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersSnap = await adminDb.collection("users").get();
    const reconnected: { email: string; tier: string; period_end: string }[] = [];
    const noStripeSub: { email: string; tier: string; reason: string }[] = [];
    let scanned = 0;

    for (const doc of usersSnap.docs) {
      const data = doc.data() as Record<string, unknown>;
      const tier = (data.tier as string) || "free";
      const isPaid = ["starter", "growth", "empire"].includes(tier);
      if (!isPaid) continue; // only care about paid tiers
      scanned++;

      const customerId = data.stripe_customer_id as string | undefined;
      const email = (data.email as string) || doc.id;

      if (!customerId) {
        noStripeSub.push({ email, tier, reason: "no stripe_customer_id (manual/Revolut)" });
        continue;
      }

      // Ask Stripe for this customer's subscriptions
      let subs;
      try {
        subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 });
      } catch {
        noStripeSub.push({ email, tier, reason: "stripe lookup failed" });
        continue;
      }

      // Find a live subscription (active or trialing)
      const live = subs.data.find((s) => s.status === "active" || s.status === "trialing");
      if (!live) {
        noStripeSub.push({ email, tier, reason: "no active/trialing subscription in Stripe" });
        continue;
      }

      const priceId = live.items.data[0]?.price?.id;
      const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;
      const periodEndUnix = (live as unknown as { current_period_end?: number; current_period?: { end?: number } }).current_period_end
        || (live as unknown as { current_period?: { end?: number } }).current_period?.end
        || null;
      const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;

      await adminDb.collection("users").doc(doc.id).set({
        stripe_subscription_id: live.id,
        status: live.status === "trialing" ? "trialing" : "active",
        tier: tierInfo?.tier || tier,
        billing_period_end: periodEnd,
        reconciled_at: new Date().toISOString(),
        reconciled_by: admin.email,
      }, { merge: true });

      reconnected.push({ email, tier: tierInfo?.tier || tier, period_end: periodEnd || "unknown" });
    }

    return NextResponse.json({
      ok: true,
      scanned,
      reconnected_count: reconnected.length,
      no_stripe_sub_count: noStripeSub.length,
      reconnected,
      no_stripe_sub: noStripeSub,
      note: "Users in no_stripe_sub were NOT modified. These are Revolut/manual/comped or genuinely lapsed — review manually.",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
