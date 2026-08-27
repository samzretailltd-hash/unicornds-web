"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SITE, PLANS } from "@/lib/constants";
import { ChangelogWidget } from "@/components/ChangelogWidget";
import TelegramCTA from "@/components/TelegramCTA";

const CF_BASE = "https://us-central1-unicorn-ds-7f831.cloudfunctions.net";

// Canonical tier configs — dashboard uses these, NOT stale Firestore data
const TIER_CONFIG: Record<string, { name: string; color: string; listings: number; hunter: number; scanner: number; stock: number; bulk: number; ai: boolean; image: boolean; tracker: boolean }> = {
  trial:    { name: "7-Day Trial", color: "#7C3AED", listings: 100,  hunter: 9999, scanner: 3,    stock: 10,   bulk: 1,  ai: true,  image: false, tracker: false },
  expired:  { name: "Expired",     color: "#EF4444", listings: 0,    hunter: 1,    scanner: 0,    stock: 0,    bulk: 0,  ai: false, image: false, tracker: false },
  free:     { name: "Free",        color: "#6b6899", listings: 0,    hunter: 0,    scanner: 0,    stock: 0,    bulk: 0,  ai: false, image: false, tracker: false },
  starter:  { name: "Starter",     color: "#7C3AED", listings: 500,  hunter: 9999, scanner: 5,    stock: 20,   bulk: 1,  ai: true, image: false, tracker: false },
  growth:   { name: "Growth",      color: "#10B981", listings: 1500, hunter: 9999, scanner: 9999, stock: 9999, bulk: 5,  ai: true,  image: true,  tracker: true },
  empire:   { name: "Empire",      color: "#F59E0B", listings: 3000, hunter: 9999, scanner: 9999, stock: 9999, bulk: 10, ai: true,  image: true,  tracker: true },
  // Legacy tiers
  pro:      { name: "Growth",      color: "#10B981", listings: 1500, hunter: 9999, scanner: 9999, stock: 9999, bulk: 5,  ai: true,  image: true,  tracker: true },
  ultimate: { name: "Empire",      color: "#F59E0B", listings: 3000, hunter: 9999, scanner: 9999, stock: 9999, bulk: 10, ai: true,  image: true,  tracker: true },
};

interface UserProfile {
  tier: string;
  tierName: string;
  tierColor: string;
  email: string;
  listings_limit: number;
  listings_used: number;
  hunter_limit: number;
  scanner_limit: number;
  stock_limit: number;
  bulk_limit: number;
  ai_titles: boolean;
  image_designer: boolean;
  tracker: boolean;
  billing_period_end: string | null;
  trialEndDate: string | null;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState("");
  const router = useRouter();

  const fetchProfile = useCallback(async (u: User) => {
    try {
      const token = await u.getIdToken();
      const res = await fetch("/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) { setProfileError("Could not load profile"); return; }

      const json = await res.json();
      const raw = json.result || json;
      const tier = (raw.tier || "free").toLowerCase();
      const tc = TIER_CONFIG[tier] || TIER_CONFIG.free;

      // ═══════════════════════════════════════════════
      // SECURITY GATES — must pass ALL checks in order
      // ═══════════════════════════════════════════════

      // Gate 1: Email must be verified (reload to pick up admin changes)
      await u.reload();
      if (!u.emailVerified) {
        router.push("/verify-email");
        return;
      }

      // Gate 2: Phone must be verified (new users only)
      try {
        const profileRes = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();

        const CALL_REQUIRED_AFTER = new Date("2026-05-14T00:00:00Z").getTime();

        // Phone verification check — only for users created after May 14, 2026
        const userCreatedAt = profileData.created_at ? new Date(profileData.created_at).getTime() : 0;
        if (!profileData.phone_verified && userCreatedAt >= CALL_REQUIRED_AFTER) {
          router.push("/verify-phone");
          return;
        }

        // Gate 3: Must have a paid plan (no free access without payment)
        if (!raw.card_verified && !raw.stripe_subscription_id && tier !== "starter" && tier !== "growth" && tier !== "empire") {
          router.push("/select-plan");
          return;
        }

        // Gate 4: Must book setup call (new users only, skip if already paid)
        if (!profileData.call_booked && userCreatedAt >= CALL_REQUIRED_AFTER && tier !== "starter" && tier !== "growth" && tier !== "empire") {
          router.push("/book-call");
          return;
        }
      } catch {
        // If profile API fails, still enforce basic checks
        if (!raw.card_verified && !raw.stripe_subscription_id && tier !== "starter" && tier !== "growth" && tier !== "empire") {
          router.push("/select-plan");
          return;
        }
      }

      setProfile({
        tier,
        tierName: tc.name,
        tierColor: tc.color,
        email: raw.email || u.email || "",
        // ALWAYS use tier config for limits — never trust stale Firestore tokensTotal
        listings_limit: tc.listings,
        listings_used: raw.tokensUsed || 0,
        hunter_limit: tc.hunter,
        scanner_limit: tc.scanner,
        stock_limit: tc.stock,
        bulk_limit: tc.bulk,
        ai_titles: tc.ai,
        image_designer: tc.image,
        tracker: tc.tracker,
        billing_period_end: raw.renewalDate || null,
        trialEndDate: raw.trialEndDate || null,
        stripe_subscription_id: raw.stripe_subscription_id || "",
        stripe_customer_id: raw.stripe_customer_id || "",
      });
    } catch {
      setProfileError("Could not connect to server");
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      setLoading(false);
      fetchProfile(u);
    });
  }, [router, fetchProfile]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-[#a5a0cc]">Loading...</p></div>;

  const tier = profile?.tier || "free";
  const usagePercent = profile ? Math.min(100, profile.listings_limit > 0 ? (profile.listings_used / profile.listings_limit) * 100 : 0) : 0;
  const trialDaysLeft = profile?.trialEndDate ? Math.max(0, Math.ceil((new Date(profile.trialEndDate).getTime() - Date.now()) / 86400000)) : 0;
  const fmt = (n: number) => n >= 9999 ? "unlimited" : String(n);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">My Dashboard</h1>
            <p className="text-sm text-[#a5a0cc]">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchProfile(user!)} className="px-4 py-2 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white">Refresh</button>
            <button onClick={() => signOut(auth)} className="px-4 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10">Sign Out</button>
          </div>
        </div>

        {profileError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-sm text-red-400">{profileError}</div>}

        {/* Expired/free banner */}
        {(tier === "expired" || tier === "free") && (
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-lg font-bold text-[#F59E0B] mb-2">Choose a plan to get started</p>
            <p className="text-sm text-[#a5a0cc] mb-4">Select a plan. Trial: Starter £1 (25 listings), Growth £5 (50), Empire £10 (100). Or full price for all listings.</p>
            <Link href="/pricing" className="btn-primary px-8 py-3 rounded-xl text-sm font-bold inline-block">Choose Your Plan</Link>
          </div>
        )}

        {/* Plan & Usage Banner */}
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: (profile?.tierColor || "#6b6899") + "20", color: profile?.tierColor }}>
                {profile?.tierName?.toUpperCase() || "TRIAL"}
              </span>
              <div>
                <div className="text-white font-bold">{profile?.tierName || "Trial"} Plan</div>
                <div className="text-xs text-[#a5a0cc]">
                  {profile?.listings_limit || 0} listings{"/month"}
                  {profile?.billing_period_end ? ` · Renews ${new Date(profile.billing_period_end).toLocaleDateString()}` : ""}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard/billing"
                className="px-4 py-2.5 rounded-lg text-sm font-bold border border-[#3d3580] text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-colors flex items-center gap-1.5"
              >
                📄 Billing &amp; Invoices
              </Link>
              {(tier === "starter" || tier === "growth" || tier === "empire") && (
                <button
                  onClick={async () => {
                    try {
                      const u = auth.currentUser;
                      if (!u) return;
                      const token = await u.getIdToken();
                      const res = await fetch("/api/stripe/portal", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                      else alert(data.error || "No subscription found. If you need help, email support@unicornds.io");
                    } catch { alert("Something went wrong. Email support@unicornds.io for help."); }
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-bold border border-[#3d3580] text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-colors"
                >
                  Manage Subscription
                </button>
              )}
              <Link href="/pricing" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold text-center">
                {tier === "empire" ? "View Plans" : "Upgrade Plan"}
              </Link>
            </div>
          </div>

          {/* Usage bar */}
          {profile && profile.listings_limit > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-[#a5a0cc] mb-1.5">
                <span>Listings {"this month"}</span>
                <span className="font-bold text-white">{profile.listings_used} / {profile.listings_limit}</span>
              </div>
              <div className="h-2.5 bg-[#0f0e1a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${usagePercent}%`,
                  background: usagePercent > 90 ? "#EF4444" : usagePercent > 70 ? "#F59E0B" : "#10B981"
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-4">
              <div className="text-xs text-[#a5a0cc] mb-1">Listings Used</div>
              <div className="text-2xl font-bold text-white">{profile.listings_used}</div>
              <div className="text-xs text-[#6b6899]">of {profile.listings_limit}{"/month"}</div>
            </div>
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-4">
              <div className="text-xs text-[#a5a0cc] mb-1">Searches Today</div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-[#6b6899]">of {fmt(profile.hunter_limit)}/day</div>
            </div>
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-4">
              <div className="text-xs text-[#a5a0cc] mb-1">Competitor Scans</div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-[#6b6899]">of {fmt(profile.scanner_limit)}/day</div>
            </div>
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-4">
              <div className="text-xs text-[#a5a0cc] mb-1">Stock Checks</div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-[#6b6899]">of {fmt(profile.stock_limit)}/day</div>
            </div>
          </div>
        )}

        {/* Feature Access */}
        {profile && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Your Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                ["Single Lister", true],
                ["Product Hunter", true],
                ["Bulk Lister", profile.bulk_limit > 0],
                ["Competitor Scanner", profile.scanner_limit > 0],
                ["Stock Checker", profile.stock_limit > 0],
                ["AI Titles", profile.ai_titles],
                ["Image Designer", profile.image_designer],
                ["Tracker & Offers", profile.tracker],
              ] as [string, boolean][]).map(([name, enabled]) => (
                <div key={name} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium ${enabled ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "bg-[#0f0e1a] text-[#6b6899] border border-[#3d3580]/30"}`}>
                  <span>{enabled ? "✓" : "🔒"}</span>{name}
                </div>
              ))}
            </div>
            {tier !== "empire" && tier !== "growth" && (
              <p className="text-xs text-[#6b6899] mt-3">🔒 features unlock when you <Link href="/pricing" className="text-[#A78BFA] hover:underline">upgrade your plan</Link></p>
            )}
          </div>
        )}

        {/* Onboarding Call Banner — shown for trial users */}
        {profile && (profile.tier === "trial" || profile.tier === "free" || profile.tier === "starter" || profile.tier === "growth" || profile.tier === "empire") && (
          <a href="https://calendly.com/1stunicornltd/30min" target="_blank" rel="noopener noreferrer"
            className="block bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/30 rounded-xl p-4 mb-6 hover:border-[#F59E0B]/60 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">🎯 Book Your Free 1-on-1 Onboarding Call</p>
                <p className="text-xs text-[#a5a0cc] mt-0.5">30-min Google Meet with our founder — we will set up everything together</p>
              </div>
              <span className="px-4 py-2 bg-[#F59E0B] text-white text-xs font-bold rounded-lg flex-shrink-0">Book Now</span>
            </div>
          </a>
        )}

        {/* Video Tutorials */}
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Video Tutorials</h2>
            <a href="https://www.youtube.com/@Unicornds_io" target="_blank" rel="noopener noreferrer" className="text-xs text-[#A78BFA] hover:underline">View all on YouTube →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { id: "0u0vlAgMG58", title: "How to Install UnicornDS", duration: "1:32", step: "1" },
              { id: "_neMDbXWwmg", title: "Settings — Profit Margins, AI Titles", duration: "1:28", step: "2" },
              { id: "YF4Uwc_9K90", title: "Image Designer — Trust Badges", duration: "2:30", step: "3" },
              { id: "_SXume4vtdk", title: "AliExpress to eBay — 52% Profit", duration: "2:47", step: "4" },
              { id: "qo9WLT6FDWg", title: "Amazon to eBay Arbitrage — 38% Profit", duration: "3:11", step: "5" },
              { id: "65tT3HfHQbg", title: "Product Hunter — Find 45+ Products", duration: "5:45", step: "6" },
            ]).map((v) => (
              <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer"
                className="group block rounded-lg overflow-hidden border border-[#3d3580]/50 hover:border-[#7C3AED]/50 transition-all">
                <div className="relative">
                  <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt={v.title}
                    className="w-full aspect-video object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center">
                      <span className="text-white text-sm ml-0.5">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">{v.duration}</span>
                  <span className="absolute top-1 left-1 bg-[#7C3AED] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">Step {v.step}</span>
                </div>
                <div className="p-2.5">
                  <p className="text-xs text-white font-medium group-hover:text-[#A78BFA] transition-colors leading-tight">{v.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* What's New — Changelog Widget */}
        <div className="mb-6">
          <ChangelogWidget />
        </div>

        {/* Telegram community */}
        <div className="mb-6">
          <TelegramCTA />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div>
                  <p className="text-sm text-white font-medium">Install Chrome Extension</p>
                  <Link href="/download" className="text-xs text-[#A78BFA] hover:underline">Download Extension →</Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <p className="text-sm text-white font-medium">Log in with this email</p>
                  <p className="text-xs text-[#a5a0cc]">Use {user?.email} in the extension popup</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <p className="text-sm text-white font-medium">Find & list your first product</p>
                  <p className="text-xs text-[#a5a0cc]">Go to Amazon, click &quot;Scrape This Product&quot;</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Help & Resources</h2>
            <div className="space-y-2.5">
              <Link href="/blog/how-to-start-ebay-dropshipping" className="flex items-center gap-2 text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors"><span>📖</span> Beginner&apos;s Guide to eBay Dropshipping</Link>
              <Link href="/blog/amazon-to-ebay-arbitrage" className="flex items-center gap-2 text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors"><span>📖</span> Amazon to eBay Arbitrage Guide</Link>
              <Link href="/blog/ebay-vero-list-2026" className="flex items-center gap-2 text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors"><span>🛡️</span> VERO Brand List (3,390 brands)</Link>
              <Link href="/support" className="flex items-center gap-2 text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors"><span>💬</span> AI Support Chat</Link>
              <a href="mailto:support@unicornds.io" className="flex items-center gap-2 text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors"><span>✉️</span> Email Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
