import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // Support both Authorization header AND body token (backward compat)
    let token: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split("Bearer ")[1];
    }

    let body: any = {};
    try { body = await req.json(); } catch {}
    if (!token) token = body.token;

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Get Stripe customer ID from Firestore
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const customerId = userDoc.data()?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json({ error: "No subscription found. Please subscribe first." }, { status: 400 });
    }

    // Create customer portal session — allow custom return_url
    const returnUrl = body.return_url || `${req.nextUrl.origin}/dashboard/billing`;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: err.message || "Portal failed" }, { status: 500 });
  }
}
