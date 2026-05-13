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

    const { phone } = await req.json();

    // Verify that the user's Firebase Auth account now has a phone provider
    // (linkWithPhoneNumber adds it automatically)
    const authUser = await adminAuth.getUser(decoded.uid);
    const hasPhone = authUser.providerData.some(
      (p) => p.providerId === "phone"
    );

    if (!hasPhone) {
      return NextResponse.json(
        { error: "Phone not linked to account" },
        { status: 400 }
      );
    }

    // Mark phone as verified and activate account
    await adminDb.collection("users").doc(decoded.uid).set(
      {
        phone_verified: true,
        phone_verified_at: new Date().toISOString(),
        phone: phone || authUser.phoneNumber || "",
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );

    // Notify admin
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();
    sendTelegram(
      `📱 <b>Phone Verified!</b>\n👤 ${userData?.fullName || "—"}\n📧 ${decoded.email}\n📱 ${phone || authUser.phoneNumber || "—"}\n🌍 ${userData?.country || "—"}`
    ).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
