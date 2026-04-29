import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendAdminNewSignup } from "@/lib/brevo";

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
      status: "active",
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
