import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { uid, tier, billing_period_end, status, tokensTotal, tokensUsed, trialStartDate, trialEndDate } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    const update: Record<string, unknown> = { updated_by: admin.email, updated_at: new Date().toISOString() };

    // Handle tier change
    const validTiers = ["trial", "expired", "free", "starter", "growth", "empire"];
    if (tier && validTiers.includes(tier)) {
      update.tier = tier;
      if (tokensTotal !== undefined) update.tokensTotal = tokensTotal;
      if (tokensUsed !== undefined) update.tokensUsed = tokensUsed;
      if (billing_period_end !== undefined) update.billing_period_end = billing_period_end;
      if (trialStartDate !== undefined) update.trialStartDate = trialStartDate;
      if (trialEndDate !== undefined) update.trialEndDate = trialEndDate;
    }

    // Handle block/unblock
    if (status && ["active", "blocked"].includes(status)) {
      update.status = status;
    }

    await adminDb.collection("users").doc(uid).set(update, { merge: true });
    return NextResponse.json({ success: true, uid, ...update });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
