"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Module {
  num: string;
  title: string;
  lessons: number;
  time: string;
  desc: string;
  videoUrl?: string; // Future: Bunny.net signed URL
  status: "available" | "coming-soon";
}

const MODULES: Module[] = [
  { num: "01", title: "Foundation — eBay Account Setup", lessons: 6, time: "1h 20m", desc: "Account types, selling limits, business vs personal, store subscriptions, payment setup, VERO basics.", status: "coming-soon" },
  { num: "02", title: "Product Research That Wins", lessons: 8, time: "2h 15m", desc: "Find proven sellers, demand scoring, Amazon arbitrage formula, AliExpress sourcing, ZIK analytics workflow, niche selection.", status: "coming-soon" },
  { num: "03", title: "AI-Powered Listing Mastery", lessons: 7, time: "1h 50m", desc: "Cassini SEO titles, mobile-first descriptions, item specifics for ranking, image optimization, variation listings.", status: "coming-soon" },
  { num: "04", title: "VERO & Account Safety", lessons: 5, time: "1h 10m", desc: "3,629 restricted brands, suspension recovery, dispute handling, MC011 fixes, multi-account strategy.", status: "coming-soon" },
  { num: "05", title: "Order Fulfillment & Tracking", lessons: 6, time: "1h 40m", desc: "Address auto-capture, AliExpress workflow, tracking imports, late-shipment defects, refund handling.", status: "coming-soon" },
  { num: "06", title: "Scaling to £10K/Month", lessons: 8, time: "2h 30m", desc: "Bulk listing systems, repricing strategies, promoted listings, store branding, international expansion (US/DE/FR/AU/CA).", status: "coming-soon" },
  { num: "07", title: "Customer Service Templates", lessons: 4, time: "55m", desc: "12 message templates, smart variables, dispute resolution, feedback removal, building 100% positive feedback.", status: "coming-soon" },
  { num: "08", title: "Tax, Accounting & UK HMRC", lessons: 5, time: "1h 30m", desc: "VAT registration, Schedule of Goods, profit margin tracking, bookkeeping setup, tax-free thresholds.", status: "coming-soon" },
];

export default function DashboardCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);

      // Get user tier from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists()) {
          setTier(userDoc.data().tier || "free");
        }
      } catch (e) {
        console.error("Failed to load tier:", e);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
        <div className="text-[#a5a0cc]">Loading...</div>
      </div>
    );
  }

  const hasAccess = tier === "growth" || tier === "empire";
  const isEmpire = tier === "empire";

  // GATED — user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">← Back to dashboard</Link>

          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2d2875] border-2 border-[#F59E0B]/40 rounded-3xl p-10 mt-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">
              Mastery Course is Locked
            </h1>
            <p className="text-[#a5a0cc] text-lg mb-6 max-w-xl mx-auto">
              The UnicornDS Mastery Course is included <strong className="text-white">FREE</strong> with Growth and Empire plans.
              You&apos;re currently on <span className="text-[#F59E0B] font-bold uppercase">{tier}</span>.
            </p>

            <div className="bg-[#0f0e1a]/50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
              <h2 className="text-white font-bold mb-3">What you&apos;ll get with Growth (£59.99/mo):</h2>
              <ul className="space-y-2 text-sm text-[#a5a0cc]">
                <li>✅ Full 8-module Mastery Course (13+ hours)</li>
                <li>✅ Private Telegram Community</li>
                <li>✅ 1,500 listings/month (3x your current limit)</li>
                <li>✅ AI Cassini titles (GPT-4o)</li>
                <li>✅ All extension features unlocked</li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
            >
              🚀 Upgrade to Growth
            </Link>
            <p className="mt-4 text-xs text-[#6b6899]">
              30-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ACCESS GRANTED — Growth or Empire
  return (
    <div className="min-h-screen bg-[#0f0e1a] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">← Back to dashboard</Link>

        <div className="mt-3 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">🎓 UnicornDS Mastery Course</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isEmpire ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#7C3AED]/20 text-[#A78BFA]"}`}>
              {tier.toUpperCase()} ACCESS
            </span>
          </div>
          <p className="text-[#a5a0cc]">
            8 modules · 49 lessons · 13+ hours of training · Updated for 2026
          </p>
        </div>

        {/* COMING SOON BANNER */}
        <div className="bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎬</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">Course Videos Launching Soon!</h2>
              <p className="text-[#a5a0cc] text-sm mb-3">
                We&apos;re recording the full 13+ hour course right now. All Growth and Empire members get instant access when each module goes live.
                We&apos;ll email you as soon as Module 1 is ready (expected within 14 days).
              </p>
              <p className="text-xs text-[#10B981] font-bold">
                ✅ Your access is already secured — no extra payment needed when videos launch
              </p>
            </div>
          </div>
        </div>

        {/* TELEGRAM ACCESS — available NOW */}
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                {isEmpire ? "VIP Telegram + 1-on-1 Access" : "Private Telegram Community"}
              </h2>
              <p className="text-[#a5a0cc] text-sm mb-4">
                {isEmpire
                  ? "Join the VIP channel for priority answers from our team + book your 1-on-1 onboarding call."
                  : "Join the private community to chat with other sellers and get help from the team."}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@unicornds.io?subject=Telegram%20Invite%20Request&body=Hi%20team%2C%20please%20send%20me%20the%20Telegram%20group%20invite.%20My%20account%20email%20is%3A%20"
                  className="inline-block px-5 py-2.5 bg-[#7C3AED] hover:bg-[#9333EA] text-white rounded-lg text-sm font-bold transition-all"
                >
                  📩 Request Telegram Invite
                </a>
                {isEmpire && (
                  <a
                    href="mailto:support@unicornds.io?subject=1-on-1%20Onboarding%20Call&body=Hi%20team%2C%20I%27d%20like%20to%20book%20my%201-on-1%20onboarding%20call.%20My%20account%20email%20is%3A%20"
                    className="inline-block px-5 py-2.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-lg text-sm font-bold transition-all"
                  >
                    📞 Book 1-on-1 Call
                  </a>
                )}
              </div>
              <p className="text-xs text-[#6b6899] mt-3">
                We&apos;ll reply within 4 hours (UK business hours) with your private invite link.
              </p>
            </div>
          </div>
        </div>

        {/* CURRICULUM */}
        <h2 className="text-2xl font-bold text-white mb-4">Curriculum</h2>
        <div className="space-y-3 mb-8">
          {MODULES.map(m => (
            <div key={m.num} className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 flex items-start gap-5 hover:border-[#7C3AED]/60 transition-colors">
              <div className="text-3xl font-extrabold text-[#F59E0B] flex-shrink-0">{m.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">{m.title}</h3>
                  {m.status === "coming-soon" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
                      COMING SOON
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#a5a0cc] mb-2">{m.desc}</p>
                <div className="flex gap-4 text-xs text-[#6b6899]">
                  <span>📚 {m.lessons} lessons</span>
                  <span>⏱️ {m.time}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  disabled
                  className="px-4 py-2 bg-[#3d3580]/30 text-[#6b6899] rounded-lg text-xs font-bold cursor-not-allowed"
                >
                  🔒 Locked
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GUARANTEE REMINDER */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/40 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            ✅ Your 30-Day Sales Guarantee
          </h3>
          <p className="text-sm text-[#a5a0cc] max-w-xl mx-auto">
            List 10+ products in 30 days using UnicornDS. If you don&apos;t make a single sale, email{" "}
            <a href="mailto:support@unicornds.io" className="text-[#F59E0B] underline">support@unicornds.io</a>{" "}
            for a full refund. No questions, no fine print.
          </p>
        </div>
      </div>
    </div>
  );
}
