import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // Some users have "created_at" (website signup), others have "createdAt" (extension signup)
    // Fetch ALL users without orderBy to avoid silently dropping docs missing the field
    const usersSnap = await adminDb.collection("users").limit(500).get();
    const usageSnap = await adminDb.collection("usage").limit(500).get();
    const usageMap: Record<string, Record<string, unknown>> = {};
    usageSnap.docs.forEach(doc => { usageMap[doc.id] = doc.data(); });
    const users = usersSnap.docs.map(doc => {
      const data = doc.data();
      // Normalize: ensure created_at exists (prefer created_at, fallback to createdAt)
      if (!data.created_at && data.createdAt) {
        data.created_at = typeof data.createdAt === 'object' && data.createdAt._seconds
          ? new Date(data.createdAt._seconds * 1000).toISOString()
          : data.createdAt;
      }
      return { uid: doc.id, ...data, usage: usageMap[doc.id] || {} };
    });
    // Sort newest first (handle missing dates)
    users.sort((a: any, b: any) => {
      const da = a.created_at || a.createdAt || '1970-01-01';
      const db = b.created_at || b.createdAt || '1970-01-01';
      return String(db).localeCompare(String(da));
    });
    return NextResponse.json({ users, total: users.length });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
