// Abuse detection — checks for duplicate IPs, phones, device fingerprints, account sharing
import { adminDb } from "@/lib/firebase-admin";
import { sendTelegram } from "@/lib/brevo";

// ═══════════════════════════════════════════════
// 1. CHECK DUPLICATE IP — same IP on multiple accounts
// ═══════════════════════════════════════════════
export async function checkDuplicateIP(ip: string, currentUid: string): Promise<{ isDuplicate: boolean; accounts: number; uids: string[] }> {
  if (!ip) return { isDuplicate: false, accounts: 0, uids: [] };
  try {
    const snap = await adminDb.collection("users")
      .where("signup_ip", "==", ip)
      .limit(10)
      .get();
    const otherUids = snap.docs
      .filter(d => d.id !== currentUid)
      .map(d => d.id);
    return { isDuplicate: otherUids.length > 0, accounts: otherUids.length + 1, uids: otherUids };
  } catch { return { isDuplicate: false, accounts: 0, uids: [] }; }
}

// ═══════════════════════════════════════════════
// 2. CHECK DUPLICATE PHONE — same phone on multiple accounts
// ═══════════════════════════════════════════════
export async function checkDuplicatePhone(phone: string, currentUid: string): Promise<{ isDuplicate: boolean; accounts: number }> {
  if (!phone) return { isDuplicate: false, accounts: 0 };
  try {
    const normalized = phone.replace(/[\s\-()]/g, "");
    const snap = await adminDb.collection("users")
      .where("phone", "==", normalized)
      .limit(10)
      .get();
    const others = snap.docs.filter(d => d.id !== currentUid);
    return { isDuplicate: others.length > 0, accounts: others.length + 1 };
  } catch { return { isDuplicate: false, accounts: 0 }; }
}

// ═══════════════════════════════════════════════
// 3. SAVE DEVICE FINGERPRINT — from extension
// ═══════════════════════════════════════════════
export async function saveDeviceFingerprint(uid: string, fingerprint: {
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  language: string;
  platform: string;
  cores: number;
  memory: number;
  userAgent: string;
  canvasHash?: string;
  webglRenderer?: string;
}) {
  try {
    const fpHash = Buffer.from(
      `${fingerprint.screenWidth}x${fingerprint.screenHeight}_${fingerprint.timezone}_${fingerprint.platform}_${fingerprint.cores}_${fingerprint.memory}_${fingerprint.canvasHash || ''}_${fingerprint.webglRenderer || ''}`
    ).toString("base64").slice(0, 32);

    // Check if this fingerprint exists on another account
    const snap = await adminDb.collection("users")
      .where("device_fingerprint", "==", fpHash)
      .limit(5)
      .get();
    const otherAccounts = snap.docs.filter(d => d.id !== uid);

    if (otherAccounts.length > 0) {
      const otherEmails = otherAccounts.map(d => d.data()?.email || d.id).join(", ");
      sendTelegram(
        `🚨 <b>SAME DEVICE detected!</b>\n👤 UID: ${uid}\n🔗 Same device as: ${otherEmails}\n🖥️ FP: ${fpHash}\n⚠️ Possible multi-account abuse`
      ).catch(() => {});
    }

    await adminDb.collection("users").doc(uid).set({
      device_fingerprint: fpHash,
      device_info: {
        screen: `${fingerprint.screenWidth}x${fingerprint.screenHeight}`,
        timezone: fingerprint.timezone,
        language: fingerprint.language,
        platform: fingerprint.platform,
        cores: fingerprint.cores,
        memory: fingerprint.memory,
        canvasHash: fingerprint.canvasHash || "",
        webglRenderer: fingerprint.webglRenderer || "",
      },
      device_updated_at: new Date().toISOString(),
    }, { merge: true });

    return { fpHash, duplicateAccounts: otherAccounts.length };
  } catch (e) {
    console.error("[Abuse] Fingerprint save error:", e);
    return { fpHash: "", duplicateAccounts: 0 };
  }
}

// ═══════════════════════════════════════════════
// 4. CHECK ACCOUNT SHARING — multiple IPs/devices on one account
// ═══════════════════════════════════════════════
export async function trackLoginIP(uid: string, ip: string) {
  if (!ip || !uid) return;
  try {
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const data = userDoc.data();
    const loginIPs: string[] = data?.login_ips || [];

    // Add IP if not already tracked (keep last 20)
    if (!loginIPs.includes(ip)) {
      loginIPs.push(ip);
      if (loginIPs.length > 20) loginIPs.shift();

      await userRef.set({
        login_ips: loginIPs,
        last_ip: ip,
        last_login: new Date().toISOString(),
      }, { merge: true });

      // Alert if 3+ unique IPs (possible sharing)
      const uniqueIPs = [...new Set(loginIPs)];
      if (uniqueIPs.length >= 3) {
        sendTelegram(
          `⚠️ <b>Account sharing suspected</b>\n👤 ${data?.email || uid}\n🌐 ${uniqueIPs.length} unique IPs\n📍 Latest: ${ip}\n🔑 Tier: ${data?.tier || "free"}`
        ).catch(() => {});
      }
    } else {
      // Just update last login
      await userRef.set({
        last_ip: ip,
        last_login: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (e) {
    console.error("[Abuse] Login IP track error:", e);
  }
}

// ═══════════════════════════════════════════════
// 5. CHECK USAGE SPEED — flag rapid token consumption
// ═══════════════════════════════════════════════
export async function checkUsageSpeed(uid: string, tokensUsed: number, tokensTotal: number) {
  try {
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const data = userDoc.data();
    if (!data) return;

    const lastCheck = data.usage_speed_check ? new Date(data.usage_speed_check).getTime() : 0;
    const lastTokens = data.usage_speed_tokens || 0;
    const now = Date.now();
    const hoursSinceCheck = (now - lastCheck) / (1000 * 60 * 60);

    // Only check if at least 30 min since last check
    if (hoursSinceCheck < 0.5) return;

    const tokensConsumed = tokensUsed - lastTokens;

    // Flag if 100+ listings in under 1 hour (bot-like speed)
    if (tokensConsumed >= 100 && hoursSinceCheck <= 1) {
      sendTelegram(
        `🤖 <b>Rapid usage detected!</b>\n👤 ${data.email || uid}\n⚡ ${tokensConsumed} listings in ${Math.round(hoursSinceCheck * 60)} min\n📊 ${tokensUsed}/${tokensTotal} total\n🔑 Tier: ${data.tier || "free"}`
      ).catch(() => {});
    }

    // Flag if 80%+ of monthly limit used in first 3 days
    const createdAt = data.billing_period_start ? new Date(data.billing_period_start).getTime() : 0;
    const daysSinceBilling = (now - createdAt) / (1000 * 60 * 60 * 24);
    const usagePercent = tokensTotal > 0 ? (tokensUsed / tokensTotal) * 100 : 0;

    if (daysSinceBilling <= 3 && usagePercent >= 80) {
      sendTelegram(
        `📈 <b>Heavy usage alert</b>\n👤 ${data.email || uid}\n📊 ${usagePercent.toFixed(0)}% used in ${daysSinceBilling.toFixed(1)} days\n⚡ ${tokensUsed}/${tokensTotal}\n🔑 ${data.tier || "free"}`
      ).catch(() => {});
    }

    // Save checkpoint
    await userRef.set({
      usage_speed_check: new Date().toISOString(),
      usage_speed_tokens: tokensUsed,
    }, { merge: true });
  } catch (e) {
    console.error("[Abuse] Usage speed check error:", e);
  }
}

// ═══════════════════════════════════════════════
// 7. VPN / PROXY / DATACENTER DETECTION
// ═══════════════════════════════════════════════
export async function checkVPN(ip: string): Promise<{ isVPN: boolean; type: string; isp: string }> {
  if (!ip || ip === "unknown") return { isVPN: false, type: "", isp: "" };
  try {
    // Use ip-api.com free tier (45 req/min, no key needed)
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=proxy,hosting,isp,org`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { isVPN: false, type: "", isp: "" };
    const data = await res.json();
    
    const isProxy = data.proxy === true;
    const isHosting = data.hosting === true; // datacenter/VPS IP
    const isp = data.isp || data.org || "";
    
    // Known VPS/datacenter ISPs
    const datacenterKeywords = [
      "digital ocean", "digitalocean", "linode", "vultr", "hetzner",
      "amazon", "aws", "google cloud", "microsoft azure", "oracle cloud",
      "ovh", "contabo", "hostinger", "hostgator", "bluehost",
      "cloudflare", "fastly", "akamai", "rackspace",
    ];
    const ispLower = isp.toLowerCase();
    const isDatacenter = datacenterKeywords.some(k => ispLower.includes(k));
    
    return {
      isVPN: isProxy || isHosting || isDatacenter,
      type: isProxy ? "proxy/vpn" : isHosting || isDatacenter ? "datacenter/vps" : "",
      isp,
    };
  } catch {
    return { isVPN: false, type: "", isp: "" };
  }
}

// ═══════════════════════════════════════════════
// 8. ENHANCED SIGNUP ABUSE CHECK — with VPN detection
// ═══════════════════════════════════════════════
export async function runSignupAbuseChecks(uid: string, email: string, phone: string, ip: string, fullName: string) {
  const flags: string[] = [];

  // Check duplicate IP
  const ipCheck = await checkDuplicateIP(ip, uid);
  if (ipCheck.isDuplicate) {
    flags.push(`Same IP as ${ipCheck.accounts - 1} other account(s)`);
  }

  // Check duplicate phone
  const phoneCheck = await checkDuplicatePhone(phone, uid);
  if (phoneCheck.isDuplicate) {
    flags.push(`Same phone as ${phoneCheck.accounts - 1} other account(s)`);
  }

  // Check if name is suspiciously short or generic
  if (!fullName || fullName.length < 3 || /^(test|asd|xxx|abc|user|admin|hello)/i.test(fullName)) {
    flags.push(`Suspicious name: "${fullName}"`);
  }

  // Check VPN/proxy/datacenter
  const vpnCheck = await checkVPN(ip);
  if (vpnCheck.isVPN) {
    flags.push(`VPN/Proxy detected: ${vpnCheck.type} (${vpnCheck.isp})`);
  }

  // Save flags + VPN info to user doc
  const updateData: Record<string, unknown> = {
    ip_info: {
      is_vpn: vpnCheck.isVPN,
      type: vpnCheck.type,
      isp: vpnCheck.isp,
      checked_at: new Date().toISOString(),
    },
  };

  if (flags.length > 0) {
    updateData.abuse_flags = flags;
    updateData.abuse_flagged_at = new Date().toISOString();

    // Alert admin
    sendTelegram(
      `🚩 <b>Signup flags!</b>\n👤 ${fullName || "—"}\n📧 ${email}\n📱 ${phone || "—"}\n🌐 ${ip}${vpnCheck.isVPN ? ` (${vpnCheck.type})` : ""}\n🏢 ISP: ${vpnCheck.isp || "—"}\n⚠️ ${flags.join("\n⚠️ ")}`
    ).catch(() => {});
  }

  await adminDb.collection("users").doc(uid).set(updateData, { merge: true });

  return flags;
}
