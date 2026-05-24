import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded?.uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Log download in Firestore
    try {
      const userRef = adminDb.collection("users").doc(decoded.uid);
      const userDoc = await userRef.get();
      await adminDb.collection("downloads").add({
        uid: decoded.uid,
        email: decoded.email || "",
        tier: userDoc.exists ? userDoc.data()?.tier || "free" : "free",
        version: "7.20.0",
        downloadedAt: new Date().toISOString(),
        userAgent: req.headers.get("user-agent") || "",
      });
      // Update user's lastActive
      if (userDoc.exists) {
        await userRef.update({ lastActive: new Date() });
      }
    } catch (e) {
      console.error("Download log error:", e);
      // Don't block download if logging fails
    }

    // Return the download URL (hashed filename)
    return NextResponse.json({
      url: "/ext_b9d3e2f0a5c8.zip",
      filename: "UnicornDS_v7_20_0.zip",
      version: "7.20.0",
    });
  } catch (err: any) {
    console.error("Download auth error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
