import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { saveDeviceFingerprint, trackLoginIP, checkUsageSpeed, checkVPN, enforceDeviceLimit } from "@/lib/abuse-detection";
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

    // Check VPN/proxy on login — alert only ONCE per new VPN IP per user,
    // not on every login (that was flooding the channel).
    checkVPN(ip).then(async vpn => {
      if (vpn.isVPN) {
        try {
          const uref = adminDb.collection("users").doc(decoded.uid);
          const udoc = await uref.get();
          const alerted: string[] = udoc.data()?.vpn_ips_alerted || [];
          if (!alerted.includes(ip)) {
            alerted.push(ip);
            if (alerted.length > 30) alerted.shift();
            await uref.set({ vpn_ips_alerted: alerted }, { merge: true });
            sendTelegram(
              `🔒 <b>VPN/Proxy login</b>\n👤 ${decoded.email}\n🌐 ${ip}\n🏢 ${vpn.type}: ${vpn.isp}`
            ).catch(() => {});
          }
        } catch { /* ignore */ }
      }
    }).catch(() => {});

    // Save device fingerprint (detects multi-account abuse)
    let fpResult = { fpHash: "", stableHash: "", duplicateAccounts: 0 };
    if (fingerprint) {
      fpResult = await saveDeviceFingerprint(decoded.uid, fingerprint);
    }

    // Enforce per-tier device limit (Starter/Growth = 1 device, Empire = 4).
    let deviceCheck = { allowed: true, limit: 1, count: 0, devices: [] as string[] };
    if (fpResult.stableHash) {
      const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
      const tier = (userSnap.data()?.tier || "free").toLowerCase();
      deviceCheck = await enforceDeviceLimit(decoded.uid, fpResult.stableHash, tier);
    }

    // Check usage speed (detects bot-like behaviour)
    if (typeof tokensUsed === "number" && typeof tokensTotal === "number") {
      checkUsageSpeed(decoded.uid, tokensUsed, tokensTotal).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      fp: fpResult.fpHash,
      device_allowed: deviceCheck.allowed,
      device_limit: deviceCheck.limit,
      device_count: deviceCheck.count,
      flags: [
        ...(fpResult.duplicateAccounts > 0 ? ["duplicate_device"] : []),
        ...(!deviceCheck.allowed ? ["device_limit_exceeded"] : []),
      ],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
