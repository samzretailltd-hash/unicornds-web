import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";
import { recordAffiliateCommission } from "@/lib/affiliateCommission";
import { sendWelcomeEmail, sendAdminNewPayment, sendAdminCancellation, sendAdminPaymentFailed, sendTelegram } from "@/lib/brevo";

// Resolve a Firebase user UID for a Stripe subscription even when the
// subscription is missing firebase_uid metadata (older/trial subs).
// Order: metadata.firebase_uid -> users where stripe_customer_id -> users where email.
async function resolveUid(sub: any, fallbackEmail?: string | null): Promise<string | null> {
  const metaUid = sub?.metadata?.firebase_uid;
  if (metaUid) return metaUid;

  // Fallback 1: match by Stripe customer id stored on the user doc
  const custId = typeof sub?.customer === "string" ? sub.customer : sub?.customer?.id;
  if (custId) {
    const snap = await adminDb.collection("users").where("stripe_customer_id", "==", custId).limit(1).get();
    if (!snap.empty) return snap.docs[0].id;
  }

  // Fallback 2: match by email
  const email = fallbackEmail || sub?.customer_email || null;
  if (email) {
    const snap = await adminDb.collection("users").where("email", "==", email).limit(1).get();
    if (!snap.empty) return snap.docs[0].id;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const uid = session.metadata?.firebase_uid;
        if (!uid) break;

        const sessionMode = (session as any).mode;

        // FREE TIER: Card verification only (setup mode, no charge)
        if (sessionMode === "setup" || session.metadata?.tier === "free") {
          await adminDb.collection("users").doc(uid).set({
            tier: "free",
            tokensUsed: 0,
            tokensTotal: 0,
            status: "active",
            stripe_customer_id: (session.customer as string) || null,
            card_verified: true,
            card_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { merge: true });
          console.log("[Stripe] Card verified:", session.customer_email, "-> free (card verified)");
          // Send welcome email + admin notification
          const email = session.customer_email || "";
          sendWelcomeEmail(email, "", "free", 0).catch(() => {});
          sendAdminNewPayment({ email, tier: "free", amount: 0, currency: "gbp", period: "n/a", isTrial: false }).catch(() => {});
          sendTelegram(`✅ <b>Card Verified!</b>\n📧 ${email}\n📋 Free tier`).catch(() => {});
          break;
        }

        // PAID TIERS: Charged immediately, no trial
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;
        const tier = tierInfo?.tier || session.metadata?.tier || "starter";
        const isTrialing = sub.status === "trialing";
        // Trust Stripe's real state: if the subscription is trialing, it's a trial (metadata.mode can be missing/wrong on yearly).
        const checkoutMode = isTrialing ? "trial" : "full";

        // Trial mode: limited listings. Full mode: full listings.
        const TRIAL_TOKENS: Record<string, number> = { starter: 25, growth: 50, empire: 100 };
        const FULL_TOKENS: Record<string, number> = { starter: 500, growth: 1500, empire: 3000 };
        const tokensTotal = checkoutMode === "trial" ? (TRIAL_TOKENS[tier] || 25) : (FULL_TOKENS[tier] || tierInfo?.tokensTotal || 500);
        const trialEnd = (sub as any).trial_end
          ? new Date((sub as any).trial_end * 1000).toISOString()
          : null;

        await adminDb.collection("users").doc(uid).set({
          tier,
          tokensUsed: 0,
          tokensTotal,
          status: isTrialing ? "trialing" : "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          card_verified: true,
          billing_period: tierInfo?.period || session.metadata?.period || "monthly",
          billing_period_end: (() => {
            const pe = (sub as any).current_period_end
              || (sub as any).items?.data?.[0]?.current_period_end
              || null;
            return pe ? new Date(pe * 1000).toISOString() : null;
          })(),
          trial_end: trialEnd,
          trial_used: isTrialing ? true : undefined,
          trial_started_at: isTrialing ? new Date().toISOString() : undefined,
          trial_tier: isTrialing ? tier : undefined,
          trial_listings: isTrialing ? tokensTotal : undefined,
          updated_at: new Date().toISOString(),
        }, { merge: true });

        await adminDb.collection("payments").add({
          uid,
          email: session.customer_email || "",
          tier,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || "gbp",
          status: "completed",
          stripe_session_id: session.id,
          stripe_subscription_id: subscriptionId,
          received_at: new Date().toISOString(),
        });
        console.log("[Stripe] Paid:", session.customer_email, "->", tier);
        // Send welcome email + admin notification
        const custEmail = session.customer_email || "";
        const userName = session.customer_details?.name || "";
        sendWelcomeEmail(custEmail, userName, tier, isTrialing ? 14 : 0).catch(() => {});
        sendAdminNewPayment({
          email: custEmail,
          tier,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || "gbp",
          period: tierInfo?.period || "monthly",
          isTrial: isTrialing,
        }).catch(() => {});
        sendTelegram(`${isTrialing ? "🎯" : "💰"} <b>${isTrialing ? "New Trial!" : "New Payment!"}</b>\n📧 ${custEmail}\n📋 ${tier.toUpperCase()} (${tierInfo?.period || "monthly"})\n💷 ${isTrialing ? "£0 (7-day £1 trial)" : "£" + ((session.amount_total || 0) / 100).toFixed(2)}`).catch(() => {});

        // AFFILIATE COMMISSION (new system: fixed per plan, recurring). Onboarding, real payments only.
        try {
          const affCode = (sub.metadata && sub.metadata.affiliate_code) || (session.metadata && session.metadata.affiliate_code) || "";
          if (!isTrialing && affCode) {
            const r = await recordAffiliateCommission({ code: affCode, plan: tier, orderId: session.id, customerEmail: custEmail, amount: (session.amount_total || 0) / 100 });
            if (r.ok && r.commission) {
              sendTelegram(`🤝 <b>Affiliate Commission!</b>\n📧 ${custEmail}\n📋 ${tier.toUpperCase()}\n💷 £${r.commission.toFixed(2)} → code ${affCode}`).catch(() => {});
            } else if (!r.ok) { console.log("[Affiliate] skipped:", r.reason); }
          }
        } catch (e) { console.error("[Affiliate] Commission error:", e); }

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const uid = await resolveUid(sub);
        if (!uid) break;

        const priceId = sub.items.data[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;

        if (tierInfo) {
          const isTrialing = sub.status === "trialing";
          const trialEnd = (sub as any).trial_end
            ? new Date((sub as any).trial_end * 1000).toISOString()
            : null;

          await adminDb.collection("users").doc(uid).set({
            tier: tierInfo.tier,
            tokensTotal: tierInfo.tokensTotal,
            billing_period: tierInfo.period,
            billing_period_end: (sub as any).current_period_end
              ? new Date((sub as any).current_period_end * 1000).toISOString()
              : null,
            status: isTrialing ? "trialing" : "active",
            trial_end: trialEnd,
            updated_at: new Date().toISOString(),
          }, { merge: true });
        }

        // Only update tier/status info, NEVER reset usage here
        // Usage reset happens ONLY in invoice.payment_succeeded (actual renewal)
        if (sub.status === "active" && !(sub as any).cancel_at_period_end) {
          await adminDb.collection("users").doc(uid).set({
            status: "active",
          }, { merge: true });
          console.log("[Stripe] Subscription active:", uid, "-> status updated (usage NOT reset)");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const uid = await resolveUid(sub);
        if (!uid) break;

        // GUARD: if the customer still has ANOTHER live subscription, do NOT downgrade.
        // (A duplicate/cancelled sub must not wipe a paying customer's access.)
        try {
          const custId = sub.customer as string;
          if (custId) {
            const others = await stripe.subscriptions.list({ customer: custId, status: "all", limit: 20 });
            const hasOtherLiveSub = others.data.some(o =>
              o.id !== sub.id && ["active", "trialing", "past_due"].includes(o.status)
            );
            if (hasOtherLiveSub) {
              console.log("[Stripe] Cancelled duplicate for", uid, "— keeping access (another live sub exists)");
              sendTelegram(`ℹ️ <b>Duplicate sub cancelled</b>\n${uid} still has an active subscription — access kept.`).catch(() => {});
              break;
            }
          }
        } catch (e) { console.error("[Stripe] deleted-guard error:", e); }

        await adminDb.collection("users").doc(uid).set({
          tier: "free",
          tokensUsed: 0,
          tokensTotal: 0,
          billing_period: null,
          billing_period_end: null,
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }, { merge: true });
        console.log("[Stripe] Cancelled:", uid, "-> free");
        // Notify admin
        const cancelledUser = await adminDb.collection("users").doc(uid).get();
        const cancelledEmail = cancelledUser.data()?.email || uid;
        sendAdminCancellation(cancelledEmail, sub.metadata?.tier || "unknown").catch(() => {});
        sendTelegram(`❌ <b>Subscription Cancelled</b>\n📧 ${cancelledEmail}\n📋 ${sub.metadata?.tier || "unknown"}`).catch(() => {});
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const sub = (invoice as any).subscription
          ? await stripe.subscriptions.retrieve((invoice as any).subscription as string)
          : null;
        const uid = await resolveUid(sub, (invoice as any).customer_email);
        if (!uid) break;

        // GUARD: don't lock out the user if they have ANOTHER live subscription
        // (a failing duplicate must not zero a paying customer's tokens).
        try {
          const custId2 = sub?.customer as string;
          if (custId2) {
            const others2 = await stripe.subscriptions.list({ customer: custId2, status: "all", limit: 20 });
            const hasOtherLiveSub = others2.data.some(o =>
              o.id !== sub?.id && ["active", "trialing"].includes(o.status)
            );
            if (hasOtherLiveSub) {
              console.log("[Stripe] Payment failed on duplicate for", uid, "— access kept (another live sub).");
              break;
            }
          }
        } catch (e) { console.error("[Stripe] failed-guard error:", e); }

        await adminDb.collection("users").doc(uid).set({
          status: "payment_failed",
          tokensTotal: 0,
          tokensUsed: 0,
          updated_at: new Date().toISOString(),
        }, { merge: true });
        console.log("[Stripe] Payment failed:", uid);
        // Notify admin
        const failedUser = await adminDb.collection("users").doc(uid).get();
        const failedEmail = failedUser.data()?.email || uid;
        sendAdminPaymentFailed(failedEmail, sub?.metadata?.tier || "unknown").catch(() => {});
        sendTelegram(`⚠️ <b>Payment Failed!</b>\n📧 ${failedEmail}\n📋 ${sub?.metadata?.tier || "unknown"}\nStripe will retry automatically.`).catch(() => {});
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        // Skip the first invoice (initial subscription) — already handled by checkout.session.completed
        if ((invoice as any).billing_reason === "subscription_create") break;

        const sub = (invoice as any).subscription
          ? await stripe.subscriptions.retrieve((invoice as any).subscription as string)
          : null;
        const uid = await resolveUid(sub, (invoice as any).customer_email);
        if (!uid) break;
        if (!sub) break;

        // Reset credits on renewal
        const priceId = sub.items.data[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;

        await adminDb.collection("users").doc(uid).set({
          tokensUsed: 0,
          tokensTotal: tierInfo?.tokensTotal || 500,
          status: "active",
          billing_period_end: (() => {
            const pe = (sub as any).current_period_end || (sub as any).items?.data?.[0]?.current_period_end || null;
            return pe ? new Date(pe * 1000).toISOString() : null;
          })(),
          updated_at: new Date().toISOString(),
        }, { merge: true });

        // Log payment
        await adminDb.collection("payments").add({
          uid,
          email: (invoice as any).customer_email || "",
          tier: tierInfo?.tier || sub.metadata?.tier || "unknown",
          amount: ((invoice as any).amount_paid || 0) / 100,
          currency: (invoice as any).currency || "gbp",
          status: "completed",
          stripe_invoice_id: invoice.id,
          billing_reason: "renewal",
          received_at: new Date().toISOString(),
        });

        // recurring commission on renewal (new affiliate system)
        try {
          const affCodeR = sub.metadata && sub.metadata.affiliate_code;
          if (affCodeR) {
            const rc = await recordAffiliateCommission({ code: affCodeR, plan: (tierInfo && tierInfo.tier) || (sub.metadata && sub.metadata.tier) || "starter", orderId: invoice.id, customerEmail: (invoice as any).customer_email, amount: ((invoice as any).amount_paid || 0) / 100 });
            if (rc.ok && rc.commission) { sendTelegram(`🔄🤝 <b>Recurring commission!</b>\n💷 £${rc.commission.toFixed(2)} → code ${affCodeR}`).catch(() => {}); }
          }
        } catch (e) { console.error("[Affiliate] Renewal commission error:", e); }
        console.log("[Stripe] Renewal:", uid, "-> credits reset, £" + (((invoice as any).amount_paid || 0) / 100));
        // Notify admin
        const renewedUser = await adminDb.collection("users").doc(uid).get();
        sendAdminNewPayment({
          email: renewedUser.data()?.email || uid,
          tier: tierInfo?.tier || "unknown",
          amount: ((invoice as any).amount_paid || 0) / 100,
          currency: (invoice as any).currency || "gbp",
          period: tierInfo?.period || "monthly",
          isTrial: false,
        }).catch(() => {});
        sendTelegram(`🔄 <b>Monthly Renewal!</b>\n📧 ${renewedUser.data()?.email || uid}\n📋 ${(tierInfo?.tier || "unknown").toUpperCase()}\n💷 £${(((invoice as any).amount_paid || 0) / 100).toFixed(2)}\n✅ Credits reset to 0`).catch(() => {});
        break;
      }
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
