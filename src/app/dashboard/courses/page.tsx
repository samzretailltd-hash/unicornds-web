"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

type Lang = "en" | "ur";

interface Module {
  num: string;
  titleEn: string;
  titleUr: string;
  lessons: number;
  time: string;
  descEn: string;
  descUr: string;
  videoUrlEn?: string;
  videoUrlUr?: string;
  status: "available" | "coming-soon";
}

const MODULES: Module[] = [
  {
    num: "01",
    titleEn: "Foundation — eBay Account Setup",
    titleUr: "Bunyaad — eBay Account Setup",
    lessons: 6,
    time: "1h 20m",
    descEn: "Account types, selling limits, Shop subscriptions, payment setup, VERO basics.",
    descUr: "Account ki qisamein, selling limits, Shop subscriptions, payment setup, VERO ki bunyaad.",
    status: "coming-soon"
  },
  {
    num: "02",
    titleEn: "Product Research That Wins",
    titleUr: "Aisi Product Research Jo Kamiyab Karaye",
    lessons: 8,
    time: "2h 15m",
    descEn: "Find proven sellers, demand scoring, Amazon arbitrage formula, AliExpress sourcing, niche selection.",
    descUr: "Proven sellers dhoondhna, demand scoring, Amazon arbitrage formula, AliExpress sourcing, niche selection.",
    status: "coming-soon"
  },
  {
    num: "03",
    titleEn: "AI-Powered Listing Mastery",
    titleUr: "AI ke Sath Listing Mastery",
    lessons: 7,
    time: "1h 50m",
    descEn: "Cassini SEO titles, mobile-first descriptions, item specifics, image optimization, variation listings.",
    descUr: "Cassini SEO titles, mobile-first descriptions, item specifics, image optimization, variation listings.",
    status: "coming-soon"
  },
  {
    num: "04",
    titleEn: "VERO & Account Safety",
    titleUr: "VERO aur Account ki Hifazat",
    lessons: 5,
    time: "1h 10m",
    descEn: "3,629 restricted brands, suspension recovery, dispute handling, MC011 fixes, multi-account strategy.",
    descUr: "3,629 restricted brands, suspension se recovery, dispute handling, MC011 fixes, multi-account strategy.",
    status: "coming-soon"
  },
  {
    num: "05",
    titleEn: "Order Fulfillment & Tracking",
    titleUr: "Order Fulfillment aur Tracking",
    lessons: 6,
    time: "1h 40m",
    descEn: "Address auto-capture, AliExpress workflow, tracking imports, late-shipment defects, refund handling.",
    descUr: "Address auto-capture, AliExpress workflow, tracking imports, late shipment defects, refund handling.",
    status: "coming-soon"
  },
  {
    num: "06",
    titleEn: "Scaling to £10K/Month",
    titleUr: "£10,000 mahine tak Scale Karna",
    lessons: 8,
    time: "2h 30m",
    descEn: "Bulk listing systems, repricing, promoted listings, store branding, international expansion.",
    descUr: "Bulk listing systems, repricing, promoted listings, store branding, international markets mein expand karna.",
    status: "coming-soon"
  },
  {
    num: "07",
    titleEn: "Customer Service Templates",
    titleUr: "Customer Service Templates",
    lessons: 4,
    time: "55m",
    descEn: "12 message templates, smart variables, dispute resolution, building 100% positive feedback.",
    descUr: "12 message templates, smart variables, dispute resolution, 100% positive feedback banana.",
    status: "coming-soon"
  },
  {
    num: "08",
    titleEn: "Tax, Accounting & UK HMRC",
    titleUr: "Tax, Accounting aur UK HMRC",
    lessons: 5,
    time: "1h 30m",
    descEn: "VAT registration, business expenses, profit margin tracking, bookkeeping, year-end tax return.",
    descUr: "VAT registration, business expenses, profit margin tracking, bookkeeping, saal ka tax return.",
    status: "coming-soon"
  },
];

// UI translations
const UI = {
  back: { en: "← Back to dashboard", ur: "← Dashboard par wapas" },
  title: { en: "🎓 UnicornDS Mastery Course", ur: "🎓 UnicornDS Mastery Course" },
  subtitle: {
    en: "8 modules · 49 lessons · 13+ hours of training · Updated for 2026",
    ur: "8 modules · 49 lessons · 13+ ghante ki training · 2026 ke liye updated"
  },
  comingTitle: { en: "Course Videos Launching Soon!", ur: "Course Videos Bahut Jald!" },
  comingDesc: {
    en: "We're recording the full 13+ hour course in English & Urdu. All Growth and Empire members get instant access when each module goes live. We'll email you as soon as Module 1 is ready (expected within 14 days).",
    ur: "Hum English aur Urdu dono mein 13+ ghante ka course record kar rahe hain. Growth aur Empire members ko har module live hote hi instant access milega. Module 1 tayyar hote hi aap ko email karenge (14 din ke andar)."
  },
  comingSecured: {
    en: "✅ Your access is already secured — no extra payment needed when videos launch",
    ur: "✅ Aap ka access pehle se confirm hai — videos launch hone par koi extra payment nahi"
  },
  telegramTitle: {
    en: "Private Telegram Community",
    ur: "Private Telegram Community"
  },
  telegramVip: {
    en: "VIP Telegram + 1-on-1 Access",
    ur: "VIP Telegram + 1-on-1 Access"
  },
  telegramDesc: {
    en: "Join the private community to chat with other sellers and get help from the team.",
    ur: "Private community join karein, doosre sellers se baat karein aur team se madad lein."
  },
  telegramDescVip: {
    en: "Join the VIP channel for priority answers from our team + book your 1-on-1 onboarding call.",
    ur: "VIP channel join karein priority jawabon ke liye + apni 1-on-1 onboarding call book karein."
  },
  telegramBtn: { en: "📩 Request Telegram Invite", ur: "📩 Telegram Invite Manga'ein" },
  callBtn: { en: "📞 Book 1-on-1 Call", ur: "📞 1-on-1 Call Book Karein" },
  telegramFooter: {
    en: "We'll reply within 4 hours (UK business hours) with your private invite link.",
    ur: "Hum 4 ghante mein jawab denge (UK business hours) aap ke private invite link ke saath."
  },
  curriculum: { en: "Curriculum", ur: "Course ka Khaka" },
  lessons: { en: "lessons", ur: "lessons" },
  comingSoon: { en: "COMING SOON", ur: "BAHUT JALD" },
  locked: { en: "🔒 Locked", ur: "🔒 Locked" },
  watch: { en: "▶️ Watch", ur: "▶️ Dekhein" },
  guaranteeTitle: { en: "✅ Your 30-Day Sales Guarantee", ur: "✅ Aap ki 30-Din Sales Guarantee" },
  guaranteeDesc: {
    en: "List 10+ products in 30 days using UnicornDS. If you don't make a single sale, email support@unicornds.io for a full refund. No questions, no fine print.",
    ur: "UnicornDS use kar ke 30 din mein 10+ products list karein. Agar ek bhi sale nahi hui, support@unicornds.io ko email karein full refund ke liye. Koi sawal nahi, koi shart nahi."
  },
  lockedTitle: { en: "Mastery Course is Locked", ur: "Mastery Course Locked Hai" },
  lockedSubtitle: {
    en: "The UnicornDS Mastery Course is included FREE with Growth and Empire plans. You're currently on",
    ur: "UnicornDS Mastery Course Growth aur Empire plans ke saath MUFT hai. Aap abhi"
  },
  lockedYouGet: { en: "What you'll get with Growth (£59.99/mo):", ur: "Growth (£59.99/mo) ke saath kya milega:" },
  lockedBenefits: {
    en: [
      "✅ Full 8-module Mastery Course in English & Urdu",
      "✅ Private Telegram Community",
      "✅ 1,500 listings/month (3x your current limit)",
      "✅ AI Cassini titles (GPT-4o)",
      "✅ All extension features unlocked"
    ],
    ur: [
      "✅ Mukammal 8-module Mastery Course English aur Urdu mein",
      "✅ Private Telegram Community",
      "✅ 1,500 listings/month (aap ki current limit ka 3 guna)",
      "✅ AI Cassini titles (GPT-4o)",
      "✅ Sab extension features unlock"
    ]
  },
  lockedCta: { en: "🚀 Upgrade to Growth", ur: "🚀 Growth par Upgrade Karein" },
  lockedFooter: {
    en: "30-day money-back guarantee · Cancel anytime",
    ur: "30-din money-back guarantee · Kabhi bhi cancel"
  },
  loading: { en: "Loading...", ur: "Load ho raha hai..." },
};

export default function DashboardCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("uds_course_lang");
    if (saved === "en" || saved === "ur") setLang(saved);

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
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

  const changeLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("uds_course_lang", newLang);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
        <div className="text-[#a5a0cc]">{UI.loading[lang]}</div>
      </div>
    );
  }

  const hasAccess = tier === "growth" || tier === "empire";
  const isEmpire = tier === "empire";

  // GATED
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">{UI.back[lang]}</Link>

          {/* Language toggle */}
          <LangToggle lang={lang} onChange={changeLang} />

          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2d2875] border-2 border-[#F59E0B]/40 rounded-3xl p-10 mt-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">
              {UI.lockedTitle[lang]}
            </h1>
            <p className="text-[#a5a0cc] text-lg mb-6 max-w-xl mx-auto">
              {UI.lockedSubtitle[lang]} <span className="text-[#F59E0B] font-bold uppercase">{tier}</span>.
            </p>

            <div className="bg-[#0f0e1a]/50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
              <h2 className="text-white font-bold mb-3">{UI.lockedYouGet[lang]}</h2>
              <ul className="space-y-2 text-sm text-[#a5a0cc]">
                {UI.lockedBenefits[lang].map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <Link
              href="/pricing"
              className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
            >
              {UI.lockedCta[lang]}
            </Link>
            <p className="mt-4 text-xs text-[#6b6899]">{UI.lockedFooter[lang]}</p>
          </div>
        </div>
      </div>
    );
  }

  // ACCESS GRANTED
  return (
    <div className="min-h-screen bg-[#0f0e1a] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">{UI.back[lang]}</Link>

        {/* Language toggle */}
        <LangToggle lang={lang} onChange={changeLang} />

        <div className="mt-3 mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-white">{UI.title[lang]}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isEmpire ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#7C3AED]/20 text-[#A78BFA]"}`}>
              {tier.toUpperCase()} ACCESS
            </span>
          </div>
          <p className="text-[#a5a0cc]">
            {UI.subtitle[lang]}
          </p>
        </div>

        {/* COMING SOON BANNER */}
        <div className="bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎬</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{UI.comingTitle[lang]}</h2>
              <p className="text-[#a5a0cc] text-sm mb-3">{UI.comingDesc[lang]}</p>
              <p className="text-xs text-[#10B981] font-bold">{UI.comingSecured[lang]}</p>
            </div>
          </div>
        </div>

        {/* TELEGRAM */}
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💬</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                {isEmpire ? UI.telegramVip[lang] : UI.telegramTitle[lang]}
              </h2>
              <p className="text-[#a5a0cc] text-sm mb-4">
                {isEmpire ? UI.telegramDescVip[lang] : UI.telegramDesc[lang]}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@unicornds.io?subject=Telegram%20Invite%20Request&body=Hi%20team%2C%20please%20send%20me%20the%20Telegram%20group%20invite.%20My%20account%20email%20is%3A%20"
                  className="inline-block px-5 py-2.5 bg-[#7C3AED] hover:bg-[#9333EA] text-white rounded-lg text-sm font-bold transition-all"
                >
                  {UI.telegramBtn[lang]}
                </a>
                {isEmpire && (
                  <a
                    href="mailto:support@unicornds.io?subject=1-on-1%20Onboarding%20Call&body=Hi%20team%2C%20I%27d%20like%20to%20book%20my%201-on-1%20onboarding%20call.%20My%20account%20email%20is%3A%20"
                    className="inline-block px-5 py-2.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-lg text-sm font-bold transition-all"
                  >
                    {UI.callBtn[lang]}
                  </a>
                )}
              </div>
              <p className="text-xs text-[#6b6899] mt-3">{UI.telegramFooter[lang]}</p>
            </div>
          </div>
        </div>

        {/* CURRICULUM */}
        <h2 className="text-2xl font-bold text-white mb-4">{UI.curriculum[lang]}</h2>
        <div className="space-y-3 mb-8">
          {MODULES.map(m => {
            const title = lang === "ur" ? m.titleUr : m.titleEn;
            const desc = lang === "ur" ? m.descUr : m.descEn;
            const videoUrl = lang === "ur" ? m.videoUrlUr : m.videoUrlEn;
            const isPlayable = m.status === "available" && videoUrl;
            return (
              <div key={m.num} className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 flex items-start gap-5 hover:border-[#7C3AED]/60 transition-colors">
                <div className="text-3xl font-extrabold text-[#F59E0B] flex-shrink-0">{m.num}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    {m.status === "coming-soon" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
                        {UI.comingSoon[lang]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#a5a0cc] mb-2">{desc}</p>
                  <div className="flex gap-4 text-xs text-[#6b6899]">
                    <span>📚 {m.lessons} {UI.lessons[lang]}</span>
                    <span>⏱️ {m.time}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isPlayable ? (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold transition-all">
                      {UI.watch[lang]}
                    </a>
                  ) : (
                    <button disabled className="px-4 py-2 bg-[#3d3580]/30 text-[#6b6899] rounded-lg text-xs font-bold cursor-not-allowed">
                      {UI.locked[lang]}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* GUARANTEE */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/40 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">{UI.guaranteeTitle[lang]}</h3>
          <p className="text-sm text-[#a5a0cc] max-w-xl mx-auto">
            {UI.guaranteeDesc[lang]}{" "}
            <a href="mailto:support@unicornds.io" className="text-[#F59E0B] underline">support@unicornds.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Language toggle component
function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-2 mt-4 mb-2">
      <span className="text-xs text-[#6b6899] font-bold uppercase tracking-wider">Language / Zubaan:</span>
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === "en"
            ? "bg-[#7C3AED] text-white"
            : "bg-[#1E1B4B]/50 text-[#a5a0cc] hover:text-white border border-[#3d3580]"
        }`}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => onChange("ur")}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === "ur"
            ? "bg-[#7C3AED] text-white"
            : "bg-[#1E1B4B]/50 text-[#a5a0cc] hover:text-white border border-[#3d3580]"
        }`}
      >
        🇵🇰 Urdu (Roman)
      </button>
    </div>
  );
}
