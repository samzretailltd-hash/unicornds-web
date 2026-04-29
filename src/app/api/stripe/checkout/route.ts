import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { stripe, TIER_PRICES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { token, tier, period, trial } = await req.json();

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Check if customer already exists in Stripe
    const existing = await stripe.customers.list({ email: decoded.email!, limit: 1 });
    let customerId: string | undefined;
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    }

    // FREE TIER: Card verification only (£0 charge)
    if (tier === "free") {
      const session = await stripe.checkout.sessions.create({
        mode: "setup",
        payment_method_types: ["card"],
        customer: customerId,
        customer_email: customerId ? undefined : decoded.email!,
        metadata: {
          firebase_uid: decoded.uid,
          tier: "free",
        },
        custom_text: {
          submit: {
            message: "You will NOT be charged. We verify your card to prevent abuse. You get 100 free eBay listings — no hidden fees, cancel anytime.",
          },
        },
        success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/pricing`,
      });
      return NextResponse.json({ url: session.url });
    }

    // PAID TIERS: With or without trial
    const prices = TIER_PRICES[tier];
    if (!prices) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    const priceId = period === "yearly" ? prices.yearly : prices.monthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : decoded.email!,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trial ? 14 : undefined,
        metadata: {
          firebase_uid: decoded.uid,
          tier,
          period: period || "monthly",
        },
      },
      metadata: {
        firebase_uid: decoded.uid,
        tier,
        period: period || "monthly",
      },
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/select-plan`,
      allow_promotion_codes: true,
      ...(trial ? {
        custom_text: {
          submit: {
            message: `Your 14-day free trial starts now. You will NOT be charged until the trial ends. Cancel anytime.`,
          },
        },
      } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
