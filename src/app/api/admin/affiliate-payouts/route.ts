import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const admin = verifyAdmin(decoded.email || "");
    if (!admin) return NextResponse.json({ error: "Not admin" }, { status: 403 });

    const payoutsSnap = await adminDb.collection("affiliate_payouts")
      .orderBy("created_at", "desc")
      .limit(50)
      .get();

    const payouts = payoutsSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({ payouts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
