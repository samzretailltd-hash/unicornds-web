import { adminDb } from "@/lib/firebase-admin";
import { commissionFor } from "@/lib/affiliateConfig";
import { FieldValue } from "firebase-admin/firestore";

export async function recordAffiliateCommission(opts: {
  code?: string | null;
  plan: string;
  orderId: string;
  customerEmail?: string | null;
  amount?: number | null;
}): Promise<{ ok: boolean; reason?: string; commission?: number }> {
  const code = (opts.code || "").trim();
  if (!code) return { ok: false, reason: "no code" };
  if (!opts.orderId) return { ok: false, reason: "no orderId" };
  const dup = await adminDb.collection("conversions").where("orderId", "==", opts.orderId).limit(1).get();
  if (!dup.empty) return { ok: true, commission: 0, reason: "deduped" };
  const snap = await adminDb.collection("affiliates").where("code", "==", code).limit(1).get();
  if (snap.empty) return { ok: false, reason: "unknown code: " + code };
  const affDoc = snap.docs[0];
  const aff = affDoc.data() as any;
  if (aff.status === "suspended") return { ok: false, reason: "affiliate suspended" };
  const tier = aff.tier || "standard";
  const plan = String(opts.plan || "").toLowerCase();
  const commission = commissionFor(plan, tier);
  if (commission <= 0) return { ok: false, reason: "no commission for plan: " + plan };
  await adminDb.collection("conversions").add({
    affiliateId: affDoc.id, code, plan, tier,
    customerEmail: opts.customerEmail ? String(opts.customerEmail).toLowerCase() : null,
    amount: opts.amount != null ? Number(opts.amount) : null,
    commission, orderId: opts.orderId, status: "pending", createdAt: new Date().toISOString(),
  });
  await affDoc.ref.update({
    conversions: FieldValue.increment(1),
    totalEarnings: FieldValue.increment(commission),
    pendingEarnings: FieldValue.increment(commission),
  });
  return { ok: true, commission };
}
