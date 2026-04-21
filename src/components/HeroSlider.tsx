'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    badge: "🚀 Product Demo",
    title: "List Products in Seconds",
    desc: "Scrape from Amazon or AliExpress → AI-optimised title → auto-fill eBay listing → per-variant images uploaded automatically. One click, fully automated.",
    highlights: ["AI Titles", "Auto Images", "VERO Protection", "Bulk Listing"],
    color: "#7C3AED",
  },
  {
    badge: "📈 Real Results",
    title: "Our Sellers Are Scaling Fast",
    desc: "Real eBay Seller Hub dashboards from UnicornDS users. From zero to thousands of orders in months.",
    stats: [
      { label: "Seller A • 3mo", value: "£4,920", sub: "932 orders" },
      { label: "Seller B • 4mo", value: "£8,621", sub: "1,462 orders" },
      { label: "Seller C • 6mo", value: "£16,107", sub: "2,685 orders" },
      { label: "Seller D • 8mo", value: "£24,126", sub: "4,000+ orders" },
    ],
    color: "#10B981",
  },
  {
    badge: "⚔️ Why UnicornDS",
    title: "Features No Competitor Has",
    desc: "The only eBay tool with per-variant image upload, built-in VERO protection, and zero data sharing. Your products stay private.",
    comparison: [
      { feature: "Per-variant images", us: true, them: false },
      { feature: "VERO brand checker", us: true, them: false },
      { feature: "No API needed", us: true, them: false },
      { feature: "Data stays in browser", us: true, them: false },
      { feature: "AI title generation", us: true, them: true },
      { feature: "Competitor scanner", us: true, them: true },
    ],
    color: "#F59E0B",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="py-16 border-b border-[#3d3580]/20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${i === current ? 'bg-[#7C3AED] text-white' : 'bg-[#1E1B4B]/60 text-[#a5a0cc] border border-[#3d3580]/40 hover:border-[#7C3AED]/60'}`}>
              {s.badge}
            </button>
          ))}
        </div>

        {/* Slide content */}
        <div className="rounded-2xl border border-[#3d3580]/40 bg-[#1E1B4B]/40 p-8 sm:p-10 min-h-[320px] transition-all">
          <div className="text-center mb-6">
            <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: slide.color }}>{slide.title}</h3>
            <p className="text-[#a5a0cc] max-w-2xl mx-auto">{slide.desc}</p>
          </div>

          {/* Slide 1: Highlights */}
          {slide.highlights && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {slide.highlights.map((h, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-sm text-[#A78BFA] font-medium">{h}</span>
              ))}
            </div>
          )}

          {/* Slide 2: Stats */}
          {slide.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {slide.stats.map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-[#0d0b2e]/50 border border-[#3d3580]/30">
                  <p className="text-xs text-[#6b6899] mb-1">{s.label}</p>
                  <p className="text-xl font-bold text-[#34D399]">{s.value}</p>
                  <p className="text-xs text-[#a5a0cc]">{s.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Slide 3: Comparison */}
          {slide.comparison && (
            <div className="max-w-md mx-auto mt-6">
              <div className="flex justify-between text-xs font-semibold text-[#6b6899] mb-2 px-4">
                <span>Feature</span>
                <div className="flex gap-8"><span className="text-[#F59E0B]">UnicornDS</span><span>Others</span></div>
              </div>
              {slide.comparison.map((c, i) => (
                <div key={i} className="flex justify-between items-center py-2 px-4 rounded-lg text-sm text-[#c8c4e0] odd:bg-[#0d0b2e]/30">
                  <span>{c.feature}</span>
                  <div className="flex gap-12">
                    <span>{c.us ? '✅' : '❌'}</span>
                    <span>{c.them ? '✅' : '❌'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
