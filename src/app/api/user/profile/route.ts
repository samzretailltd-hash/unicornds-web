import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendAdminNewSignup, sendTelegram } from "@/lib/brevo";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { runSignupAbuseChecks } from "@/lib/abuse-detection";

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
      ip_country: data.ip_country || "",
      tier: data.tier || "free",
      status: data.status || "active",
      created_at: data.created_at || "",
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
    const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    // BLOCK: Disposable/temp email addresses
    if (decoded.email && isDisposableEmail(decoded.email)) {
      sendTelegram(`🚫 <b>Blocked disposable email!</b>\n📧 ${decoded.email}\n🌐 ${ip}`).catch(() => {});
      return NextResponse.json({ error: "Please use a real email address. Temporary/disposable emails are not allowed." }, { status: 400 });
    }

    // Check if user already exists
    const existingDoc = await adminDb.collection("users").doc(decoded.uid).get();
    
    if (existingDoc.exists) {
      // Existing user — only update provided fields, don't reset tier/tokens
      const updates: Record<string, unknown> = {
        last_ip: ip,
        last_login: new Date().toISOString(),
      };
      if (phone) updates.phone = phone;
      if (fullName) updates.fullName = fullName;
      if (country) updates.country = country;
      if (ref) updates.ref = ref;

      await adminDb.collection("users").doc(decoded.uid).set(updates, { merge: true });

      return NextResponse.json({ ok: true, message: "Profile updated" });
    }

    // New user — full signup flow
    await adminDb.collection("users").doc(decoded.uid).set({
      email: decoded.email,
      fullName: fullName || "",
      phone: phone || "",
      country: country || "",
      ref: ref || null,
      tier: "free",
      tokensUsed: 0,
      tokensTotal: 0,
      status: "pending_phone_verification",
      phone_verified: false,
      signup_ip: ip,
      last_ip: ip,
      login_ips: [ip],
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    }, { merge: true });

    // Detect real country from IP (don't trust user input)
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,isp,proxy,hosting`, {
        signal: AbortSignal.timeout(3000),
      });
      if (geoRes.ok) {
        const geo = await geoRes.json();
        await adminDb.collection("users").doc(decoded.uid).set({
          ip_country: geo.country || "",
          ip_country_code: geo.countryCode || "",
          ip_city: geo.city || "",
          ip_isp: geo.isp || "",
          ip_is_proxy: geo.proxy || false,
          ip_is_hosting: geo.hosting || false,
        }, { merge: true });

        // Alert if claimed country differs from IP country
        if (country && geo.country && country.toLowerCase() !== geo.country.toLowerCase()) {
          sendTelegram(
            `🚩 <b>Country mismatch!</b>\n👤 ${fullName || "—"}\n📧 ${decoded.email}\n🌐 Claims: ${country}\n📍 IP says: ${geo.country} (${geo.city})\n🏢 ISP: ${geo.isp}${geo.proxy ? "\n⚠️ PROXY/VPN" : ""}${geo.hosting ? "\n⚠️ DATACENTER" : ""}`
          ).catch(() => {});
        }
      }
    } catch { /* geo lookup failed — continue */ }

    // Run abuse checks (duplicate IP, phone, suspicious name) — async, don't block signup
    runSignupAbuseChecks(decoded.uid, decoded.email || "", phone || "", ip, fullName || "").catch(() => {});

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
