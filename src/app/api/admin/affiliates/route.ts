import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const snap = await adminDb.collection("affiliate_applications").orderBy("applied_at", "desc").limit(100).get();
    const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ applications: apps });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status, refCode } = await req.json();
    if (!id || !["approved","rejected"].includes(status)) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const update: Record<string, unknown> = { status, reviewed_by: admin.email, reviewed_at: new Date().toISOString() };
    if (refCode) update.ref_code = refCode;
    await adminDb.collection("affiliate_applications").doc(id).update(update);
    return NextResponse.json({ ok: true });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
