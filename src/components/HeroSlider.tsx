'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    icon: "🛡️",
    badge: "VERO PROTECTION",
    title: "3,390+ Brands Blocked Before You List",
    desc: "eBay will suspend your account for listing trademarked brands. UnicornDS checks EVERY product against 3,390+ VERO-protected brands and blocks them BEFORE they reach eBay. Zero risk.",
    highlights: ["Nike", "Adidas", "Dyson", "Apple", "Sony", "Samsung", "Aveeno", "+ 3,383 more"],
    cta: "See How VERO Protection Works",
    ctaLink: "/features/vero-protection",
    color: "#EF4444",
    accentBg: "rgba(239,68,68,0.08)",
    accentBorder: "rgba(239,68,68,0.25)",
    badgeBg: "rgba(239,68,68,0.15)",
    badgeColor: "#F87171",
  },
  {
    icon: "🔒",
    badge: "YOUR DATA IS SAFE",
    title: "We NEVER Steal or Sell Your Data",
    desc: "Unlike other tools that upload your product data to their servers, UnicornDS runs 100% inside your browser. Your eBay account, products, and business data NEVER leave your device.",
    comparison: [
      { feature: "Data stays on your device", us: true, them: false },
      { feature: "No server uploads", us: true, them: false },
      { feature: "No tracking or analytics on your products", us: true, them: false },
      { feature: "No selling your data to third parties", us: true, them: false },
      { feature: "Works offline after install", us: true, them: false },
    ],
    cta: "Start 14-Day Free Trial",
    ctaLink: "/signup",
    color: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
    badgeBg: "rgba(16,185,129,0.15)",
    badgeColor: "#34D399",
  },
  {
    icon: "⚡",
    badge: "100% PRIVATE CHROME EXTENSION",
    title: "Your Business Stays Yours. Period.",
    desc: "Other tools are web apps — they see everything. UnicornDS is a Chrome extension. Your eBay credentials, supplier links, pricing strategy, and product research stay in YOUR browser. We cannot access them even if we wanted to.",
    trust: [
      { icon: "🖥️", label: "Runs Locally", detail: "Chrome extension, not a web app" },
      { icon: "🔐", label: "Zero Server Access", detail: "We never see your eBay login" },
      { icon: "🚫", label: "No Data Mining", detail: "We don't analyse your products" },
      { icon: "✅", label: "Open Inspection", detail: "Check our code yourself in DevTools" },
    ],
    cta: "Download Extension",
    ctaLink: "/download",
    color: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    badgeBg: "rgba(245,158,11,0.15)",
    badgeColor: "#FBBF24",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 7000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = SLIDES[current];

  return (
    <section
      className="py-14 border-b border-[#3d3580]/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-8">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                i === current
                  ? 'text-white shadow-lg'
                  : 'bg-[#1E1B4B]/60 text-[#a5a0cc] border border-[#3d3580]/40 hover:border-[#7C3AED]/60'
              }`}
              style={i === current ? { background: s.color, boxShadow: `0 4px 20px ${s.color}40` } : {}}
            >
              <span>{s.icon}</span> {s.badge}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((s, i) => (
            <div key={i} className="h-1 rounded-full overflow-hidden" style={{ width: '80px', background: 'rgba(61,53,128,0.3)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: i === current ? '100%' : i < current ? '100%' : '0%',
                  background: s.color,
                  transition: i === current ? 'width 7s linear' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Slide Content */}
        <div
          className="rounded-2xl p-8 sm:p-10 min-h-[320px] transition-all duration-500"
          style={{ background: slide.accentBg, border: `1px solid ${slide.accentBorder}` }}
        >
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">{slide.icon}</span>
            <h3
              className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold mb-3"
              style={{ color: slide.color }}
            >
              {slide.title}
            </h3>
            <p className="text-[#c4c0e0] max-w-2xl mx-auto leading-relaxed">{slide.desc}</p>
          </div>

          {/* Slide 1: VERO Brands */}
          {slide.highlights && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {slide.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: i < slide.highlights!.length - 1 ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.25)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: i < slide.highlights!.length - 1 ? '#F87171' : '#fff',
                  }}
                >
                  {i < slide.highlights!.length - 1 ? '🚫 ' : ''}{h}
                </span>
              ))}
            </div>
          )}

          {/* Slide 2: Privacy Comparison */}
          {slide.comparison && (
            <div className="max-w-lg mx-auto mt-6">
              <div className="flex justify-between text-xs font-bold text-[#6b6899] mb-2 px-4">
                <span></span>
                <div className="flex gap-6">
                  <span className="text-[#10B981] w-20 text-center">UnicornDS</span>
                  <span className="w-20 text-center">Others</span>
                </div>
              </div>
              {slide.comparison.map((c, i) => (
                <div key={i} className="flex justify-between items-center py-3 px-4 rounded-lg text-sm text-[#c8c4e0] odd:bg-[#0d0b2e]/30">
                  <span className="font-medium">{c.feature}</span>
                  <div className="flex gap-6">
                    <span className="w-20 text-center text-lg">{c.us ? '✅' : '❌'}</span>
                    <span className="w-20 text-center text-lg">{c.them ? '✅' : '❌'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide 3: Trust Points */}
          {slide.trust && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {slide.trust.map((t, i) => (
                <div key={i} className="text-center p-5 rounded-xl bg-[#0d0b2e]/40 border border-[#3d3580]/30">
                  <span className="text-3xl block mb-2">{t.icon}</span>
                  <p className="text-sm font-bold text-[#F59E0B] mb-1">{t.label}</p>
                  <p className="text-xs text-[#a5a0cc]">{t.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href={slide.ctaLink}
              className="inline-block px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: slide.color, boxShadow: `0 4px 20px ${slide.color}40` }}
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
