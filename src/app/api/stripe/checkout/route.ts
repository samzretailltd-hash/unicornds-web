import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { stripe, TIER_PRICES } from "@/lib/stripe";
import { sendTelegram } from "@/lib/brevo";

// Trial fees per tier (create these one-time prices in Stripe Dashboard)
const TRIAL_FEES: Record<string, { priceId: string; amount: number; listings: number }> = {
  starter: { priceId: "price_1TWmGPEbEc6ySyqKS9SNPk1N", amount: 1, listings: 25 },
  growth:  { priceId: "price_1TYbBQEbEc6ySyqK3KNlu9M7", amount: 5, listings: 50 },
  empire:  { priceId: "price_1TYbC0EbEc6ySyqKdMyVkhD9", amount: 10, listings: 100 },
};

export async function POST(req: NextRequest) {
  try {
    const { token, tier, period, mode } = await req.json();
    const affiliateCode = req.cookies.get("aff_ref")?.value || "";

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    if (tier === "free") {
      return NextResponse.json({ error: "Free tier is activated automatically on signup" }, { status: 400 });
    }

    const prices = TIER_PRICES[tier];
    if (!prices) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    const priceId = period === "yearly" ? prices.yearly : prices.monthly;

    const isTrial = mode === "trial";

    // ═══════════════════════════════════════════════
    // TRIALS DISCONTINUED — no free/paid trial is ever created.
    // Every checkout is now a normal full paid subscription.
    // (Abuse-check block kept below but disabled via the flag.)
    // ═══════════════════════════════════════════════
    let trialAllowed = false;

    if (false && isTrial) {
      const abuseReasons: string[] = [];
      const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
      const userData = userDoc.data();

      // CHECK 1: Already used trial?
      if (userData?.trial_used) {
        trialAllowed = false;
        abuseReasons.push("User already used trial");
      }

      // CHECK 2: Past Stripe subscriptions?
      const existing = await stripe.customers.list({ email: decoded.email!, limit: 1 });
      if (existing.data.length > 0) {
        const subs = await stripe.subscriptions.list({
          customer: existing.data[0].id, limit: 10, status: "all",
        });
        if (subs.data.length > 0) {
          trialAllowed = false;
          abuseReasons.push(`${subs.data.length} past subscription(s)`);
        }
      }

      // CHECK 3: Same phone on another trial?
      if (userData?.phone) {
        const phoneSnap = await adminDb.collection("users")
          .where("phone", "==", userData.phone)
          .where("trial_used", "==", true)
          .limit(5).get();
        if (phoneSnap.docs.filter(d => d.id !== decoded.uid).length > 0) {
          trialAllowed = false;
          abuseReasons.push("Phone used on another trial");
        }
      }

      // CHECK 4: Same device fingerprint?
      if (userData?.device_fingerprint) {
        const fpSnap = await adminDb.collection("users")
          .where("device_fingerprint", "==", userData.device_fingerprint)
          .where("trial_used", "==", true)
          .limit(5).get();
        if (fpSnap.docs.filter(d => d.id !== decoded.uid).length > 0) {
          trialAllowed = false;
          abuseReasons.push("Device used on another trial");
        }
      }

      if (!trialAllowed && abuseReasons.length > 0) {
        sendTelegram(
          `🚫 <b>Trial blocked!</b>\n📧 ${decoded.email}\n👤 ${userData?.fullName || "—"}\n⚠️ ${abuseReasons.join(", ")}\n💰 Switching to full price`
        ).catch(() => {});
      }
    }

    // ═══════════════════════════════════════════════
    // BUILD CHECKOUT SESSION
    // ═══════════════════════════════════════════════

    // Load this user's Firestore doc so we can reuse their saved Stripe customer.
    const userDocForCustomer = await adminDb.collection("users").doc(decoded.uid).get();

    // Resolve the Stripe customer for this person.
    // IMPORTANT: reuse the customer ID we already saved in Firestore FIRST.
    // Falling back to an email lookup can create a SECOND customer for the same
    // person (which is what caused duplicate subscriptions / two-card billing).
    let customerId: string | undefined;
    const savedCustomerId = userDocForCustomer?.data()?.stripe_customer_id;
    if (savedCustomerId) {
      // Verify it still exists in Stripe (not deleted) before reusing.
      try {
        const c = await stripe.customers.retrieve(savedCustomerId);
        if (c && !(c as any).deleted) customerId = savedCustomerId;
      } catch { /* saved id invalid — fall back to email lookup below */ }
    }
    if (!customerId) {
      const existing = await stripe.customers.list({ email: decoded.email!, limit: 1 });
      if (existing.data.length > 0) customerId = existing.data[0].id;
    }

    // ═══════════════════════════════════════════════
    // DUPLICATE SUBSCRIPTION GUARD
    // Block a second subscription if the customer already has an active or
    // trialing one — this is what caused a customer to be billed twice.
    // ═══════════════════════════════════════════════
    if (customerId) {
      const activeSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 20,
      });
      const live = activeSubs.data.filter(sub =>
        ["active", "trialing", "past_due", "unpaid"].includes(sub.status)
      );
      if (live.length > 0) {
        sendTelegram(
          `⚠️ <b>Duplicate subscription blocked</b>\n📧 ${decoded.email}\n👤 ${decoded.name || "—"}\nAlready has ${live.length} live subscription(s) — sent to billing portal instead.`
        ).catch(() => {});
        // Send them to manage their existing subscription rather than create a new one
        try {
          const portal = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.nextUrl.origin}/dashboard/billing`,
          });
          return NextResponse.json({ url: portal.url, alreadySubscribed: true });
        } catch (e) {
          return NextResponse.json(
            { error: "You already have an active subscription. Manage it from your billing page." },
            { status: 409 }
          );
        }
      }
    }

    const lineItems: { price: string; quantity: number }[] = [
      { price: priceId, quantity: 1 },
    ];

    // Add trial fee only if trial is allowed and price ID exists
    const trialFee = TRIAL_FEES[tier];
    if (trialAllowed && trialFee && !trialFee.priceId.includes("PRICE_ID")) {
      lineItems.push({ price: trialFee.priceId, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : decoded.email!,
      line_items: lineItems,
      subscription_data: {
        trial_period_days: trialAllowed ? 7 : undefined,
        metadata: {
          firebase_uid: decoded.uid,
          affiliate_code: affiliateCode,
          tier,
          period: period || "monthly",
          mode: trialAllowed ? "trial" : "full",
          trial_listings: trialAllowed ? String(trialFee?.listings || 25) : "0",
        },
      },
      metadata: {
        firebase_uid: decoded.uid,
          affiliate_code: affiliateCode,
        tier,
        period: period || "monthly",
        mode: trialAllowed ? "trial" : "full",
      },
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/select-plan`,
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: trialAllowed
            ? `You'll be charged £${trialFee?.amount || 1} today for your 7-day trial with ${trialFee?.listings || 25} listings. After 7 days, your full subscription starts automatically.`
            : `You'll be charged the full subscription price starting today. Full access with all listings.`,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
