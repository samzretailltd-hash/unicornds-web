import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  // Verify user auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Get user profile
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userDoc.data() as any;
    const customerId = user.stripe_customer_id;

    const profile = {
      tier: user.tier || "free",
      status: user.status || "free",
      tokensUsed: user.tokensUsed || 0,
      tokensTotal: user.tokensTotal || 0,
      billing_period_end: user.billing_period_end || null,
      trial_end: user.trial_end || null,
      stripe_customer_id: customerId || null,
    };

    if (!customerId) {
      return NextResponse.json({ invoices: [], upcoming: null, profile });
    }

    // Fetch all invoices
    const invoicesResp = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
    });

    const invoices = invoicesResp.data.map(inv => ({
      id: inv.id,
      number: inv.number || "",
      amount_paid: inv.amount_paid,
      amount_due: inv.amount_due,
      currency: inv.currency,
      status: inv.status || "unknown",
      created: inv.created,
      invoice_pdf: inv.invoice_pdf || "",
      hosted_invoice_url: inv.hosted_invoice_url || "",
      period_start: inv.period_start,
      period_end: inv.period_end,
      description: inv.description || "",
    }));

    // Fetch upcoming invoice if subscription exists
    let upcoming = null;
    if (user.stripe_subscription_id) {
      try {
        const upcomingInv = await (stripe.invoices as any).retrieveUpcoming({
          customer: customerId,
        });
        upcoming = {
          amount_due: upcomingInv.amount_due,
          currency: upcomingInv.currency,
          next_payment_attempt: upcomingInv.next_payment_attempt,
          period_end: upcomingInv.period_end,
        };
      } catch {
        // No upcoming invoice (canceled or expired)
      }
    }

    return NextResponse.json({ invoices, upcoming, profile });
  } catch (err: any) {
    console.error("[Invoices API] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
