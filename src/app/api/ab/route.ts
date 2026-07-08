import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { test, variant, event } = await req.json();
    if (!test || !variant || !event) {
      return NextResponse.json({ error: "test, variant, event required." }, { status: 400 });
    }
    const id = `${test}__${variant}`;
    const ref = db.collection("abtests").doc(id);
    const field = event === "conversion" ? "conversions" : "impressions";
    await ref.set({ test, variant, [field]: FieldValue.increment(1) }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "ab failed" }, { status: 500 });
  }
}
