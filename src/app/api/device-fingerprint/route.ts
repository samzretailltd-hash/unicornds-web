import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { saveDeviceFingerprint, trackLoginIP, checkUsageSpeed, checkVPN } from "@/lib/abuse-detection";
import { sendTelegram } from "@/lib/brevo";

// POST: Extension sends device fingerprint + login event
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const { fingerprint, tokensUsed, tokensTotal } = await req.json();

    const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    // Track login IP (detects account sharing)
    trackLoginIP(decoded.uid, ip).catch(() => {});

    // Check VPN/proxy on login
    checkVPN(ip).then(vpn => {
      if (vpn.isVPN) {
        sendTelegram(
          `🔒 <b>VPN/Proxy login</b>\n👤 ${decoded.email}\n🌐 ${ip}\n🏢 ${vpn.type}: ${vpn.isp}`
        ).catch(() => {});
      }
    }).catch(() => {});

    // Save device fingerprint (detects multi-account abuse)
    let fpResult = { fpHash: "", duplicateAccounts: 0 };
    if (fingerprint) {
      fpResult = await saveDeviceFingerprint(decoded.uid, fingerprint);
    }

    // Check usage speed (detects bot-like behaviour)
    if (typeof tokensUsed === "number" && typeof tokensTotal === "number") {
      checkUsageSpeed(decoded.uid, tokensUsed, tokensTotal).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      fp: fpResult.fpHash,
      flags: fpResult.duplicateAccounts > 0 ? ["duplicate_device"] : [],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
