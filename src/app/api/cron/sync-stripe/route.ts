import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";

// Runs every 6 hours via vercel.json cron
// Protected by CRON_SECRET env var (Vercel auto-sets Authorization header)
export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel adds this header automatically for cron jobs)
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Cron] Starting Stripe sync");
  const startTime = Date.now();

  try {
    const usersSnap = await adminDb.collection("users").get();
    let synced = 0;
    let blocked = 0;
    let downgraded = 0;
    let errors = 0;

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const subId = data.stripe_subscription_id;
      if (!subId) continue;

      try {
        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["latest_invoice"],
        }) as any;

        const latestInvoice = sub.latest_invoice;
        const invoiceStatus = latestInvoice?.status;
        const invoicePaid = latestInvoice?.paid === true;

        let realStatus = "active";
        let shouldBlock = false;

        if (sub.status === "canceled" || sub.status === "unpaid") {
          realStatus = "canceled";
          shouldBlock = true;
        } else if (sub.status === "past_due") {
          realStatus = "payment_failed";
          shouldBlock = true;
        } else if (sub.status === "trialing") {
          realStatus = "trialing";
        } else if (sub.status === "active") {
          if (invoiceStatus === "open" && !invoicePaid) {
            realStatus = "payment_failed";
            shouldBlock = true;
          } else {
            realStatus = "active";
          }
        }

        const priceId = sub.items?.data?.[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;

        const update: Record<string, unknown> = {
          billing_period_end: (() => {
            const pe = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null;
            return pe ? new Date(pe * 1000).toISOString() : null;
          })(),
          trial_end: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          status: realStatus,
          synced_at: new Date().toISOString(),
        };

        if (shouldBlock) {
          update.tokensTotal = 0;
          update.tokensUsed = 0;
          blocked++;
          if (sub.status === "canceled") {
            update.tier = "free";
            update.stripe_subscription_id = null;
            downgraded++;
          }
        }

        if (realStatus === "active" && tierInfo && data.tokensTotal === 0) {
          update.tokensTotal = tierInfo.tokensTotal;
        }

        await adminDb.collection("users").doc(doc.id).set(update, { merge: true });
        synced++;
      } catch (e: any) {
        if (e.message?.includes("No such subscription")) {
          await adminDb.collection("users").doc(doc.id).set({
            tier: "free",
            tokensTotal: 0,
            tokensUsed: 0,
            status: "canceled",
            stripe_subscription_id: null,
            synced_at: new Date().toISOString(),
          }, { merge: true });
          downgraded++;
        } else {
          errors++;
          console.error("[Cron] Error syncing", doc.id, e.message);
        }
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Cron] Sync done in ${elapsed}s: ${synced} synced, ${blocked} blocked, ${downgraded} downgraded, ${errors} errors`);

    // ════════════════════════════════════════════════════════════
    // PASS 2: Expire orphan trial users (no Stripe sub but trial_end passed)
    // Catches users whose trial ran out and never converted
    // ════════════════════════════════════════════════════════════
    let expiredTrials = 0;
    const now = new Date();
    for (const doc of usersSnap.docs) {
      const data = doc.data();
      // Skip users with active Stripe subscription (handled above)
      if (data.stripe_subscription_id) continue;
      // Skip already-free users
      if (!data.tier || data.tier === "free") continue;
      // Skip manually-managed paid customers (active/paid set by admin, no Stripe sub)
      if (data.status === "active" || data.status === "paid") continue;
      // Skip if no trial_end (shouldn't happen but safe)
      if (!data.trial_end) continue;
      // Only expire users who are actually in/after a trial, never manually-set ones
      if (data.trialUsed && data.status !== "trialing") continue;

      const trialEnd = new Date(data.trial_end);
      if (trialEnd < now) {
        await adminDb.collection("users").doc(doc.id).set({
          tier: "free",
          tokensTotal: 0,
          tokensUsed: 0,
          status: "canceled",
          synced_at: new Date().toISOString(),
        }, { merge: true });
        expiredTrials++;
        console.log(`[Cron] Expired orphan trial: ${data.email || doc.id}`);
      }
    }
    if (expiredTrials > 0) {
      console.log(`[Cron] Expired ${expiredTrials} orphan trial accounts`);
    }

    return NextResponse.json({
      ok: true,
      elapsed: `${elapsed}s`,
      synced,
      blocked,
      downgraded,
      expiredTrials,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Cron] Fatal error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
