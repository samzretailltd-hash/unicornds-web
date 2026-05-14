import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendTelegram } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    await adminDb.collection("users").doc(decoded.uid).set(
      {
        call_booked: true,
        call_booked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );

    // Notify admin
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();
    sendTelegram(
      `📞 <b>Call Booked!</b>\n👤 ${userData?.fullName || "—"}\n📧 ${decoded.email}\n📱 ${userData?.phone || "—"}\n🎯 ${userData?.tier || "free"}`
    ).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
