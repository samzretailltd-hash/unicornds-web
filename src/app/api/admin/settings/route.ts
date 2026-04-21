import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const doc = await adminDb.collection("settings").doc("extension").get();
    return NextResponse.json(doc.exists ? doc.data() : { min_version: "6.0.0", latest_version: "6.3.0", maintenance: false, message: "" });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    await adminDb.collection("settings").doc("extension").set({ ...data, updated_by: admin.email, updated_at: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
