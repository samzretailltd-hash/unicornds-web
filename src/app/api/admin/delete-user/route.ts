import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAILS = ["samzretailltd@gmail.com"];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAILS.includes(decoded.email || "")) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

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
