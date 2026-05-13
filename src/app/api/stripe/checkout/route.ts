import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { stripe, TIER_PRICES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { token, tier, period } = await req.json();

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Check if customer already exists in Stripe
    const existing = await stripe.customers.list({ email: decoded.email!, limit: 1 });
    let customerId: string | undefined;
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    }

    // FREE TIER: No card needed anymore — free tier is activated on signup
    if (tier === "free") {
      return NextResponse.json({ error: "Free tier is activated automatically on signup" }, { status: 400 });
    }

    // PAID TIERS: £1 for 7-day trial, then full price
    const prices = TIER_PRICES[tier];
    if (!prices) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    const priceId = period === "yearly" ? prices.yearly : prices.monthly;

    // Build line items: subscription + optional £1 trial fee
    const lineItems: { price: string; quantity: number }[] = [
      { price: priceId, quantity: 1 },
    ];

    // Add £1 trial activation fee (create this one-time price in Stripe Dashboard)
    const trialFeePrice = process.env.STRIPE_TRIAL_FEE_PRICE_ID;
    if (trialFeePrice) {
      lineItems.push({ price: trialFeePrice, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : decoded.email!,
      line_items: lineItems,
      subscription_data: {
        trial_period_days: 7,
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
      custom_text: {
        submit: {
          message: `You'll be charged £1 today for your 7-day trial. If you don't cancel within 7 days, your subscription will start automatically. Cancel anytime.`,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
