'use client';
import { useState, useEffect, useCallback } from "react";
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
  },
  {
    icon: "🔒",
    badge: "YOUR DATA IS SAFE",
    title: "We NEVER Steal or Sell Your Data",
    desc: "Unlike other tools that upload your product data to their servers, UnicornDS runs 100% inside your browser. Your eBay account, products, and business data NEVER leave your device.",
    comparison: [
      { feature: "Data stays on your device", us: true, them: false },
      { feature: "No server uploads", us: true, them: false },
      { feature: "No tracking your products", us: true, them: false },
      { feature: "No selling your data", us: true, them: false },
      { feature: "Works offline after install", us: true, them: false },
    ],
    cta: "Start 7-Day Trial for £1",
    ctaLink: "/signup",
    color: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.25)",
  },
  {
    icon: "⚡",
    badge: "100% PRIVATE",
    title: "Your Business Stays Yours. Period.",
    desc: "Other tools are web apps \u2014 they see everything. UnicornDS is a Chrome extension. Your eBay credentials, supplier links, pricing strategy, and product research stay in YOUR browser.",
    trust: [
      { icon: "🖥️", label: "Runs Locally", detail: "Chrome extension, not a web app" },
      { icon: "🔐", label: "Zero Server Access", detail: "We never see your eBay login" },
      { icon: "🚫", label: "No Data Mining", detail: "We don't analyse your products" },
      { icon: "✅", label: "Open Inspection", detail: "Check our code in DevTools" },
    ],
    cta: "Download Extension",
    ctaLink: "/download",
    color: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    if (index === current || fading) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 350);
  }, [current, fading]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length);
        setFading(false);
      }, 350);
    }, 8000);
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
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 ${
                i === current
                  ? "text-white shadow-lg"
                  : "bg-[#1E1B4B]/60 text-[#a5a0cc] border border-[#3d3580]/40 hover:border-[#7C3AED]/60"
              }`}
              style={{
                ...(i === current ? { background: s.color, boxShadow: `0 4px 20px ${s.color}40` } : {}),
                transition: "all 0.3s ease",
              }}
            >
              <span>{s.icon}</span> <span className="hidden sm:inline">{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Slide Content */}
        <div
          className="rounded-2xl p-6 sm:p-10 min-h-[320px]"
          style={{
            background: slide.accentBg,
            border: `1px solid ${slide.accentBorder}`,
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">{slide.icon}</span>
            <h3
              className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold mb-3"
              style={{ color: slide.color }}
            >
              {slide.title}
            </h3>
            <p className="text-[#c4c0e0] max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">{slide.desc}</p>
          </div>

          {/* Slide 1: VERO Brands */}
          {slide.highlights && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {slide.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
                  style={{
                    background: i < slide.highlights!.length - 1 ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.25)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: i < slide.highlights!.length - 1 ? "#F87171" : "#fff",
                  }}
                >
                  {i < slide.highlights!.length - 1 ? "🚫 " : ""}{h}
                </span>
              ))}
            </div>
          )}

          {/* Slide 2: Privacy Comparison */}
          {slide.comparison && (
            <div className="max-w-lg mx-auto mt-6">
              <div className="flex justify-between text-xs font-bold text-[#6b6899] mb-2 px-4">
                <span></span>
                <div className="flex gap-4 sm:gap-6">
                  <span className="text-[#10B981] w-16 sm:w-20 text-center">UnicornDS</span>
                  <span className="w-16 sm:w-20 text-center">Others</span>
                </div>
              </div>
              {slide.comparison.map((c, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 px-4 rounded-lg text-xs sm:text-sm text-[#c8c4e0] odd:bg-[#0d0b2e]/30">
                  <span className="font-medium">{c.feature}</span>
                  <div className="flex gap-4 sm:gap-6">
                    <span className="w-16 sm:w-20 text-center text-base sm:text-lg">✅</span>
                    <span className="w-16 sm:w-20 text-center text-base sm:text-lg">❌</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide 3: Trust Points */}
          {slide.trust && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              {slide.trust.map((t, i) => (
                <div key={i} className="text-center p-4 sm:p-5 rounded-xl bg-[#0d0b2e]/40 border border-[#3d3580]/30">
                  <span className="text-2xl sm:text-3xl block mb-2">{t.icon}</span>
                  <p className="text-xs sm:text-sm font-bold text-[#F59E0B] mb-1">{t.label}</p>
                  <p className="text-[10px] sm:text-xs text-[#a5a0cc]">{t.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href={slide.ctaLink}
              className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm font-bold text-white hover:scale-105"
              style={{
                background: slide.color,
                boxShadow: `0 4px 20px ${slide.color}40`,
                transition: "transform 0.2s ease",
              }}
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
