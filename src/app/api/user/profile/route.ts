import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendAdminNewSignup, sendTelegram } from "@/lib/brevo";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const doc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!doc.exists) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data = doc.data()!;
    return NextResponse.json({
      phone: data.phone || "",
      phone_verified: data.phone_verified || false,
      call_booked: data.call_booked || false,
      fullName: data.fullName || "",
      country: data.country || "",
      tier: data.tier || "free",
      status: data.status || "active",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const { fullName, phone, country, ref } = await req.json();

    // Capture IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    await adminDb.collection("users").doc(decoded.uid).set({
      email: decoded.email,
      fullName: fullName || "",
      phone: phone || "",
      country: country || "",
      ref: ref || null,
      tier: "free",
      tokensUsed: 0,
      tokensTotal: 20,
      status: "pending_phone_verification",
      phone_verified: false,
      signup_ip: ip,
      last_ip: ip,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    }, { merge: true });

    // Notify admin about new signup (fire and forget)
    sendAdminNewSignup({
      email: decoded.email || "",
      fullName: fullName || "",
      phone: phone || "",
      country: country || "",
      ip,
    }).catch(() => {});

    // Instant Telegram alert
    sendTelegram(`🆕 <b>New Signup!</b>\n👤 ${fullName || "—"}\n📧 ${decoded.email}\n📱 ${phone || "—"}\n🌍 ${country || "—"}\n🔗 ${ip}`).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
