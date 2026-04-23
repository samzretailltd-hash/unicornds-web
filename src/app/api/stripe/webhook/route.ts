import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { stripe, PRICE_TO_TIER } from "@/lib/stripe";

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
        const subscriptionId = session.subscription as string;
        if (!uid || !subscriptionId) break;

        // Get subscription to find the price/tier
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;

        const tier = tierInfo?.tier || session.metadata?.tier || "starter";
        const tokensTotal = tierInfo?.tokensTotal || 500;

        // Update Firestore user
        await adminDb.collection("users").doc(uid).set({
          tier,
          tokensUsed: 0,
          tokensTotal,
          status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          billing_period: tierInfo?.period || "monthly",
          billing_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          trial_end: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        }, { merge: true });

        // Log payment
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

        console.log(`[Stripe] ✅ ${session.customer_email} → ${tier} (${tierInfo?.period})`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const uid = sub.metadata?.firebase_uid;
        if (!uid) break;

        const priceId = sub.items.data[0]?.price?.id;
        const tierInfo = priceId ? PRICE_TO_TIER[priceId] : null;

        if (tierInfo) {
          await adminDb.collection("users").doc(uid).set({
            tier: tierInfo.tier,
            tokensTotal: tierInfo.tokensTotal,
            billing_period: tierInfo.period,
            billing_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          }, { merge: true });
        }

        // If subscription renewed, reset tokens
        if (sub.status === "active" && !sub.cancel_at_period_end) {
          await adminDb.collection("users").doc(uid).set({
            tokensUsed: 0,
            status: "active",
          }, { merge: true });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const uid = sub.metadata?.firebase_uid;
        if (!uid) break;

        // Downgrade to free
        await adminDb.collection("users").doc(uid).set({
          tier: "free",
          tokensUsed: 0,
          tokensTotal: 10,
          billing_period: null,
          billing_period_end: null,
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }, { merge: true });

        console.log(`[Stripe] ❌ ${uid} subscription cancelled → free`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const sub = invoice.subscription
          ? await stripe.subscriptions.retrieve(invoice.subscription as string)
          : null;
        const uid = sub?.metadata?.firebase_uid;
        if (!uid) break;

        await adminDb.collection("users").doc(uid).set({
          status: "payment_failed",
          updated_at: new Date().toISOString(),
        }, { merge: true });

        console.log(`[Stripe] ⚠️ Payment failed for ${uid}`);
        break;
      }
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
