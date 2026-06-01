import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersSnap = await adminDb.collection("users").get();
    const results: { email: string; status: string }[] = [];

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const subId = data.stripe_subscription_id;
      const email = data.email || doc.id;

      if (!subId) {
        results.push({ email, status: "skipped — no subscription" });
        continue;
      }

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

        console.log("[Sync Debug]", email, "period_end:", sub.current_period_end, "type:", typeof sub.current_period_end, "trial_end:", sub.trial_end);
        const update: Record<string, unknown> = {
          billing_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          trial_end: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          status: realStatus,
          synced_at: new Date().toISOString(),
        };

        if (shouldBlock) {
          update.tokensTotal = 0;
          update.tokensUsed = 0;
          if (sub.status === "canceled") {
            update.tier = "free";
            update.stripe_subscription_id = null;
          }
        }

        if (realStatus === "active" && tierInfo && data.tokensTotal === 0) {
          update.tokensTotal = tierInfo.tokensTotal;
        }

        await adminDb.collection("users").doc(doc.id).set(update, { merge: true });

        const statusEmoji = shouldBlock ? "🚫" : realStatus === "trialing" ? "🔵" : "✅";
        results.push({
          email,
          status: `${statusEmoji} ${realStatus} — invoice: ${invoiceStatus || "n/a"} — expires: ${update.billing_period_end || "n/a"}`,
        });
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
          results.push({ email, status: "🚫 subscription deleted — downgraded to free" });
        } else {
          results.push({ email, status: `❌ ${e.message}` });
        }
      }
    }

    return NextResponse.json({ ok: true, total: results.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
