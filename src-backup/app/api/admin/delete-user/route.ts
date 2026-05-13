import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req.headers.get("authorization"));
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { uids } = await req.json();
    if (!uids || !Array.isArray(uids) || uids.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    const results: { uid: string; status: string }[] = [];

    for (const uid of uids) {
      try {
        // Delete from Firebase Auth
        try {
          await adminAuth.deleteUser(uid);
        } catch (e: any) {
          if (e.code !== "auth/user-not-found") throw e;
        }

        // Delete from Firestore users collection
        await adminDb.collection("users").doc(uid).delete();

        // Delete from Firestore usage collection
        try {
          await adminDb.collection("usage").doc(uid).delete();
        } catch {}

        results.push({ uid, status: "deleted" });
      } catch (e: any) {
        results.push({ uid, status: `error: ${e.message}` });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
