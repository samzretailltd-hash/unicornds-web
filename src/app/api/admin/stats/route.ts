import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersSnap = await adminDb.collection("users").get();
    let total = 0, free = 0, trial = 0, starter = 0, growth = 0, empire = 0;
    let paidActive = 0, paymentFailed = 0;

    usersSnap.docs.forEach(doc => {
      total++;
      const d = doc.data();
      const t = (d.tier || "free").toLowerCase();

      if (t === "trial" || t === "trialing") trial++;
      else if (t === "free") free++;
      else if (t === "starter") starter++;
      else if (t === "growth") growth++;
      else if (t === "empire") empire++;
      else free++;

      if (d.status === "payment_failed") paymentFailed++;
      if (d.status === "active" && ["starter","growth","empire"].includes(t)) paidActive++;
    });

    let payments: unknown[] = [];
    let revenue = 0;
    let revenueTrial = 0;
    let monthlyRevenue = 0;

    if (admin.role === "owner") {
      const paymentsSnap = await adminDb.collection("payments").orderBy("received_at", "desc").limit(50).get();
      payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Split revenue: real subscriptions vs trial fees
      payments.filter((p: any) => p.status === "completed").forEach((p: any) => {
        const amount = Number(p.amount) || 0;
        // Trial fees are £1, £5, £10 — exclude from real revenue
        if (amount === 1 || amount === 5 || amount === 10) {
          revenueTrial += amount;
        } else {
          revenue += amount;
        }
      });

      // MRR: ONLY count users with status === "active" AND paid tier
      monthlyRevenue = 0;
      usersSnap.docs.forEach(doc => {
        const d = doc.data();
        const t = (d.tier || "").toLowerCase();
        // Strict check: must be active status, not payment_failed, not canceled
        if (d.status === "active" && d.stripe_subscription_id) {
          if (t === "starter") monthlyRevenue += 29.99;
          else if (t === "growth") monthlyRevenue += 59.99;
          else if (t === "empire") monthlyRevenue += 99.99;
        }
      });
    }

    return NextResponse.json({
      role: admin.role,
      users: { total, free, trial, starter, growth, empire, paidActive, paymentFailed },
      payments: admin.role === "owner" ? payments.slice(0, 20) : [],
      revenue: {
        total: admin.role === "owner" ? revenue : -1,
        trial: admin.role === "owner" ? revenueTrial : -1,
        monthly: monthlyRevenue,
        currency: "GBP",
      },
    });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
