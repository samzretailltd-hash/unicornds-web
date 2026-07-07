import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { existsSync, statSync } from "fs";
import { join } from "path";

const CF_BASE = "https://www.unicornds.io";
const BREVO_KEY = process.env.BREVO_KEY || "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";

const ADMIN_EMAILS = ["1stunicorndistribution@gmail.com", "zohaib219@gmail.com"];

interface CheckResult {
  name: string;
  status: "ok" | "warning" | "error";
  message: string;
  latency?: number;
  details?: Record<string, unknown>;
}

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Auth required" }, { status: 401 });

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAILS.includes(decoded.email || "")) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const checks: CheckResult[] = [];
  const startAll = Date.now();

  // 1. FIRESTORE — read users
  try {
    const t0 = Date.now();
    const usersSnap = await adminDb.collection("users").count().get();
    const totalUsers = usersSnap.data().count;
    
    // Get tier breakdown
    const tiers: Record<string, number> = {};
    const tierSnap = await adminDb.collection("users").select("tier").get();
    tierSnap.forEach((doc) => {
      const tier = doc.data().tier || "unknown";
      tiers[tier] = (tiers[tier] || 0) + 1;
    });

    // Recent signups (last 24h)
    const yesterday = new Date(Date.now() - 86400000);
    const recentSnap = await adminDb.collection("users")
      .where("createdAt", ">=", yesterday)
      .count().get();
    const recentSignups = recentSnap.data().count;

    // Active users (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const activeSnap = await adminDb.collection("users")
      .where("lastActive", ">=", weekAgo)
      .count().get();
    const activeUsers = activeSnap.data().count;

    checks.push({
      name: "Firebase Firestore",
      status: "ok",
      message: `${totalUsers} users total, ${recentSignups} new today, ${activeUsers} active this week`,
      latency: Date.now() - t0,
      details: { totalUsers, recentSignups, activeUsers, tiers },
    });
  } catch (e: any) {
    checks.push({ name: "Firebase Firestore", status: "error", message: e.message });
  }

  // 2. FIREBASE CLOUD FUNCTIONS — ping versionCheck
  try {
    const t0 = Date.now();
    const res = await fetch(`${CF_BASE}/api/version`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: {} }),
    });
    const json = await res.json();
    const version = json.result?.latestVersion || json.latestVersion || "unknown";
    checks.push({
      name: "Server API",
      status: res.ok ? "ok" : "error",
      message: res.ok ? `Running — latest version: ${version}` : `HTTP ${res.status}`,
      latency: Date.now() - t0,
    });
  } catch (e: any) {
    checks.push({ name: "Server API", status: "error", message: e.message });
  }

  // 3. BREVO EMAIL — check account
  try {
    const t0 = Date.now();
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": BREVO_KEY },
    });
    if (res.ok) {
      const data = await res.json();
      const credits = data.plan?.[0]?.credits || 0;
      const creditsType = data.plan?.[0]?.type || "unknown";
      checks.push({
        name: "Brevo Email",
        status: credits > 10 ? "ok" : "warning",
        message: `${credits} emails remaining (${creditsType} plan)`,
        latency: Date.now() - t0,
        details: { email: data.email, credits },
      });
    } else {
      checks.push({ name: "Brevo Email", status: "error", message: `HTTP ${res.status}` });
    }
  } catch (e: any) {
    checks.push({ name: "Brevo Email", status: "error", message: e.message });
  }

  // 4. EXTENSION DOWNLOAD — check file exists
  try {
    const zipPath = join(process.cwd(), "public", "ext_d9f3a7b2e1c4.zip");
    if (existsSync(zipPath)) {
      const stats = statSync(zipPath);
      const sizeKB = Math.round(stats.size / 1024);
      checks.push({
        name: "Extension Download",
        status: sizeKB > 300 ? "ok" : "warning",
        message: `ext_d9f3a7b2e1c4.zip — ${sizeKB}KB`,
        details: { sizeKB, modified: stats.mtime.toISOString() },
      });
    } else {
      checks.push({ name: "Extension Download", status: "error", message: "ZIP file not found in public/" });
    }
  } catch (e: any) {
    checks.push({ name: "Extension Download", status: "error", message: e.message });
  }

  // 5. DOWNLOADS LOG — recent downloads
  try {
    const t0 = Date.now();
    const yesterday = new Date(Date.now() - 86400000);
    const dlSnap = await adminDb.collection("downloads")
      .where("downloadedAt", ">=", yesterday.toISOString())
      .count().get();
    const todayDownloads = dlSnap.data().count;

    const totalDlSnap = await adminDb.collection("downloads").count().get();
    const totalDownloads = totalDlSnap.data().count;

    checks.push({
      name: "Extension Downloads",
      status: "ok",
      message: `${todayDownloads} today, ${totalDownloads} total`,
      latency: Date.now() - t0,
      details: { todayDownloads, totalDownloads },
    });
  } catch (e: any) {
    checks.push({ name: "Extension Downloads", status: "warning", message: e.message });
  }

  // 6. CREDIT USAGE — check tokensUsed across all users
  try {
    const t0 = Date.now();
    const usersSnap = await adminDb.collection("users").select("tokensUsed", "tokensTotal", "tier", "email").get();
    let totalCreditsUsed = 0;
    let totalCreditsAvailable = 0;
    const heavyUsers: { email: string; used: number; total: number; tier: string }[] = [];

    usersSnap.forEach((doc) => {
      const d = doc.data();
      const used = d.tokensUsed || 0;
      const total = d.tokensTotal || 0;
      totalCreditsUsed += used;
      totalCreditsAvailable += total;
      if (used > 10) {
        heavyUsers.push({ email: d.email || doc.id, used, total, tier: d.tier || "unknown" });
      }
    });

    heavyUsers.sort((a, b) => b.used - a.used);

    checks.push({
      name: "Credit Usage",
      status: "ok",
      message: `${totalCreditsUsed} credits used across all users`,
      latency: Date.now() - t0,
      details: { totalCreditsUsed, totalCreditsAvailable, topUsers: heavyUsers.slice(0, 5) },
    });
  } catch (e: any) {
    checks.push({ name: "Credit Usage", status: "warning", message: e.message });
  }

  // 7. TRIAL STATUS — expiring soon
  try {
    const threeDays = new Date(Date.now() + 3 * 86400000);
    const expiringSnap = await adminDb.collection("users")
      .where("tier", "==", "trial")
      .where("trialEndDate", "<=", threeDays.toISOString())
      .count().get();
    const expiringSoon = expiringSnap.data().count;

    const expiredSnap = await adminDb.collection("users")
      .where("tier", "==", "expired")
      .count().get();
    const totalExpired = expiredSnap.data().count;

    checks.push({
      name: "Trials",
      status: expiringSoon > 0 ? "warning" : "ok",
      message: `${expiringSoon} expiring in 3 days, ${totalExpired} already expired`,
      details: { expiringSoon, totalExpired },
    });
  } catch (e: any) {
    checks.push({ name: "Trials", status: "warning", message: e.message });
  }

  // 8. VERCEL — if this page loads, Vercel is working
  checks.push({
    name: "Vercel Hosting",
    status: "ok",
    message: "Website is live (this page loaded)",
    latency: Date.now() - startAll,
  });

  return NextResponse.json({
    status: checks.every((c) => c.status === "ok") ? "healthy" : checks.some((c) => c.status === "error") ? "unhealthy" : "degraded",
    timestamp: new Date().toISOString(),
    totalLatency: Date.now() - startAll,
    checks,
  });
}
