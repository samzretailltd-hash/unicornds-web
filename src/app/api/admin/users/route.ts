import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const usersSnap = await adminDb.collection("users").orderBy("created_at", "desc").limit(200).get();
    const usageSnap = await adminDb.collection("usage").limit(200).get();
    const usageMap: Record<string, Record<string, unknown>> = {};
    usageSnap.docs.forEach(doc => { usageMap[doc.id] = doc.data(); });
    const users = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data(), usage: usageMap[doc.id] || {} }));
    return NextResponse.json({ users, total: users.length });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
