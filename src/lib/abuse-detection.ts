// Abuse detection — checks for duplicate IPs, phones, device fingerprints, account sharing
import { adminDb } from "@/lib/firebase-admin";
import { sendTelegram, sendDeviceLimitEmail } from "@/lib/brevo";

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
    // DETECTION hash — includes canvas + webgl (the genuinely unique per-device
    // bits). If those are missing, the fingerprint is too weak to identify a
    // device and MUST NOT be used to flag "same device" (that caused every
    // Windows/London user to look identical). We require both to be present.
    const hasStrongSignals = !!(fingerprint.canvasHash && fingerprint.webglRenderer && fingerprint.screenWidth);
    const fpHash = Buffer.from(
      `${fingerprint.screenWidth}x${fingerprint.screenHeight}_${fingerprint.platform}_${fingerprint.cores}_${fingerprint.memory}_${fingerprint.canvasHash || ''}_${fingerprint.webglRenderer || ''}`
    ).toString("base64").slice(0, 40);

    // STABLE hash for the DEVICE LIMIT — now that the fingerprint comes from a
    // real page (content script), screen/webgl are genuine and unique per
    // machine. We deliberately EXCLUDE canvasHash here (it can shift on GPU
    // driver/Chrome updates) so a browser update never looks like a new device.
    // Screen + GPU renderer + CPU cores + memory + platform is stable per device.
    const stableHash = Buffer.from(
      `${fingerprint.screenWidth}x${fingerprint.screenHeight}@${(fingerprint as any).pixelRatio || 1}_${(fingerprint as any).colorDepth || 0}_${fingerprint.platform}_${fingerprint.cores}_${fingerprint.memory}_${fingerprint.webglRenderer || ''}`
    ).toString("base64").slice(0, 40);

    // Only run the cross-account "same device" check when signals are strong,
    // so we don't spam false alerts on weak/empty fingerprints.
    let otherAccounts: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    if (hasStrongSignals) {
      const snap = await adminDb.collection("users")
        .where("device_fingerprint", "==", fpHash)
        .limit(5)
        .get();
      otherAccounts = snap.docs.filter(d => d.id !== uid);
    }

    if (hasStrongSignals && otherAccounts.length > 0) {
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

    return { fpHash, stableHash, duplicateAccounts: otherAccounts.length };
  } catch (e) {
    console.error("[Abuse] Fingerprint save error:", e);
    return { fpHash: "", stableHash: "", duplicateAccounts: 0 };
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

      // Alert on likely SHARING only — many unique IPs. Raised from 3 to 12
      // because normal users (mobile 4G, dynamic home IPs, travel) legitimately
      // rack up several IPs. Only alert ONCE, at the moment we cross the line,
      // not on every login after — this stops the constant spam.
      const uniqueIPs = [...new Set(loginIPs)];
      const SHARE_THRESHOLD = 12;
      if (uniqueIPs.length === SHARE_THRESHOLD && !data?.ip_share_alerted) {
        await userRef.set({ ip_share_alerted: true }, { merge: true });
        sendTelegram(
          `⚠️ <b>Possible account sharing</b>\n👤 ${data?.email || uid}\n🌐 ${uniqueIPs.length}+ unique IPs\n📍 Latest: ${ip}\n🔑 Tier: ${data?.tier || "unknown"}`
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

// ═══════════════════════════════════════════════
// 5. DEVICE LIMIT PER TIER — Starter/Growth = 1 device, Empire = 4
// Stores the set of devices used on an account and blocks any device
// beyond the tier's allowance. Returns { allowed, limit, count }.
// ═══════════════════════════════════════════════
// MASTER SWITCH — controlled from the ADMIN DASHBOARD (Settings tab).
// Stored in Firestore at settings/extension.device_limit_enforce.
// While OFF, the device limit NEVER blocks (alert-only). Safe default: OFF.
async function isDeviceLimitEnforced(): Promise<boolean> {
  try {
    const doc = await adminDb.collection("settings").doc("extension").get();
    return doc.exists && doc.data()?.device_limit_enforce === true;
  } catch {
    return false; // any error → never enforce (fail safe)
  }
}

const DEVICE_LIMIT_BY_TIER: Record<string, number> = {
  free: 1,
  expired: 1,
  starter: 1,
  growth: 1,
  pro: 1,        // legacy alias of growth
  empire: 4,
  ultimate: 4,   // legacy alias of empire
  trial: 1,
};

export async function enforceDeviceLimit(
  uid: string,
  fpHash: string,
  tier: string
): Promise<{ allowed: boolean; limit: number; count: number; devices: string[] }> {
  const tierKey = (tier || "free").toLowerCase();
  const limit = DEVICE_LIMIT_BY_TIER[tierKey] ?? 1;

  // SAFETY: never evaluate the limit without a solid uid + fingerprint.
  if (!fpHash || !uid) {
    return { allowed: true, limit, count: 0, devices: [] };
  }

  try {
    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();
    const data = snap.data() || {};

    // SAFETY: never block a user whose tier we can't read as a real paid tier.
    // (A momentary "free"/missing tier during sync must not lock out a payer.)
    const knownTiers = ["starter", "growth", "empire", "pro", "ultimate", "trial"];
    if (!knownTiers.includes(tierKey)) {
      return { allowed: true, limit, count: 0, devices: [] };
    }

    let devices: string[] = Array.isArray(data.device_list) ? data.device_list.slice() : [];

    // ── GRANDFATHER: existing users have no device_list yet. Their current
    // device becomes device #1 automatically and is never counted as abuse.
    if (devices.length === 0) {
      devices = [fpHash];
      await userRef.set(
        {
          device_list: devices,
          device_count: 1,
          device_limit_since: new Date().toISOString(),
          device_last_seen: new Date().toISOString(),
        },
        { merge: true }
      );
      return { allowed: true, limit, count: 1, devices };
    }

    // Known device → allow, refresh timestamp.
    if (devices.includes(fpHash)) {
      await userRef.set({ device_last_seen: new Date().toISOString() }, { merge: true });
      return { allowed: true, limit, count: devices.length, devices };
    }

    // ── GRACE PERIOD: for the first 14 days after a user's device tracking
    // started, we DO NOT block a new device — we register it and alert only.
    // This absorbs fingerprint drift from browser/GPU updates without ever
    // locking out a real customer. After grace, the limit is enforced.
    const since = data.device_limit_since ? new Date(data.device_limit_since).getTime() : Date.now();
    const withinGrace = (Date.now() - since) < 14 * 24 * 60 * 60 * 1000;

    // New device beyond the limit.
    if (devices.length >= limit) {
      if (withinGrace) {
        // Don't block during grace — just record + alert so you can watch.
        sendTelegram(
          `👀 <b>Extra device (grace period)</b>\n👤 ${data.email || uid}\n🔑 ${tier} (limit ${limit}, now ${devices.length + 1})\n🖥️ ${fpHash}\nNot blocked yet — within 14-day grace.`
        ).catch(() => {});
        // Keep only up to a sane cap so the list can't grow forever.
        if (devices.length < 10) {
          devices.push(fpHash);
          await userRef.set({ device_list: devices, device_count: devices.length, device_last_seen: new Date().toISOString() }, { merge: true });
        }
        return { allowed: true, limit, count: devices.length, devices };
      }
      // After grace → enforce ONLY if the admin has switched it on.
      const enforce = await isDeviceLimitEnforced();
      if (!enforce) {
        sendTelegram(
          `👀 <b>Over device limit (enforce OFF)</b>\n👤 ${data.email || uid}\n🔑 ${tier} (limit ${limit}, now ${devices.length + 1})\nWould block, but enforcement is disabled in admin.`
        ).catch(() => {});
        return { allowed: true, limit, count: devices.length, devices };
      }
      sendTelegram(
        `🚫 <b>Device limit reached</b>\n👤 ${data.email || uid}\n🔑 Tier: ${tier} (max ${limit} device${limit > 1 ? "s" : ""})\n🖥️ Blocked new device: ${fpHash}\n📊 Already using ${devices.length} devices`
      ).catch(() => {});
      // Email the user ONCE (not every page load) so they know how to fix it.
      if (!data.device_limit_emailed && data.email) {
        userRef.set({ device_limit_emailed: new Date().toISOString() }, { merge: true }).catch(() => {});
        sendDeviceLimitEmail(data.email, data.fullName || data.name || "", tier, limit).catch(() => {});
      }
      return { allowed: false, limit, count: devices.length, devices };
    }

    // Under the limit — register this new device.
    devices.push(fpHash);
    await userRef.set(
      { device_list: devices, device_count: devices.length, device_last_seen: new Date().toISOString() },
      { merge: true }
    );
    if (devices.length > 1) {
      sendTelegram(
        `➕ <b>New device registered</b>\n👤 ${data.email || uid}\n🔑 Tier: ${tier} (${devices.length}/${limit})\n🖥️ ${fpHash}`
      ).catch(() => {});
    }
    return { allowed: true, limit, count: devices.length, devices };
  } catch (e) {
    console.error("[Abuse] enforceDeviceLimit error:", e);
    // On ANY error, fail OPEN — never lock out a customer over a glitch.
    return { allowed: true, limit, count: 0, devices: [] };
  }
}
