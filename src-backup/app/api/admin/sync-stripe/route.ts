import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";
import { stripe } from "@/lib/stripe";

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
        const sub = await stripe.subscriptions.retrieve(subId) as any;
        const update: Record<string, unknown> = {
          billing_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          trial_end: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          status: sub.status === "trialing" ? "trialing" : sub.status === "active" ? "active" : data.status,
          synced_at: new Date().toISOString(),
        };

        await adminDb.collection("users").doc(doc.id).set(update, { merge: true });
        results.push({ email, status: `✅ synced — expires ${update.billing_period_end || "n/a"}` });
      } catch (e: any) {
        results.push({ email, status: `❌ ${e.message}` });
      }
    }

    return NextResponse.json({ ok: true, total: results.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
