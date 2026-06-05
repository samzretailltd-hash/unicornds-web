"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Supplier glass card ───────────────────────────── */
function SupplierCard({
  src,
  alt,
  white,
  delay,
  top,
}: {
  src: string;
  alt: string;
  white?: boolean;
  delay: string;
  top: string;
}) {
  return (
    <div
      className="hs-glass hs-float"
      style={{
        position: "absolute",
        top,
        left: 0,
        width: 158,
        borderRadius: 14,
        padding: "14px 18px",
        animationDelay: delay,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 54,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ height: 22, width: "auto" }}
        className={white ? "brightness-0 invert" : ""}
      />
    </div>
  );
}

type Slide = {
  id: string;
  badge: string;
  headline: React.ReactNode;
  sub: string;
  cta: { label: string; href: string };
  /** which suppliers to show wired into eBay */
  suppliers: { src: string; alt: string; white?: boolean }[];
};

const SLIDES: Slide[] = [
  {
    id: "three-giants",
    badge: "3 SUPPLIERS · ONE TOOL",
    headline: (
      <>
        Source from 3 giants.{" "}
        <span className="hs-gradient">Sell on eBay.</span>
      </>
    ),
    sub: "Find winning products on Amazon, AliExpress & Walmart — list on eBay in seconds with AI titles & VERO protection.",
    cta: { label: "Start 7-Day Trial — £1", href: "/download" },
    suppliers: [
      { src: "/logos/amazon.svg", alt: "Amazon", white: true },
      { src: "/logos/aliexpress.svg", alt: "AliExpress", white: true },
      { src: "/logos/walmart.svg", alt: "Walmart" },
    ],
  },
  {
    id: "amazon",
    badge: "AMAZON ARBITRAGE",
    headline: (
      <>
        Amazon arbitrage,{" "}
        <span className="hs-gradient">made simple.</span>
      </>
    ),
    sub: "Fast Prime delivery means happy buyers and strong seller metrics. Flip Amazon products on eBay UK, US & Canada.",
    cta: { label: "See How It Works", href: "/#features" },
    suppliers: [{ src: "/logos/amazon.svg", alt: "Amazon", white: true }],
  },
  {
    id: "aliexpress",
    badge: "ALIEXPRESS DROPSHIPPING",
    headline: (
      <>
        AliExpress{" "}
        <span className="hs-gradient">dropshipping.</span>
      </>
    ),
    sub: "Lowest sourcing cost, highest margins. Filter Choice products with fast shipping and list on eBay with one click.",
    cta: { label: "Explore Features", href: "/#features" },
    suppliers: [{ src: "/logos/aliexpress.svg", alt: "AliExpress", white: true }],
  },
  {
    id: "walmart",
    badge: "🆕 NEW SUPPLIER",
    headline: (
      <>
        Now sourcing from{" "}
        <span className="hs-gradient">Walmart.</span>
      </>
    ),
    sub: "Expand to the US & Canada markets with Walmart. Competitive prices, fast domestic shipping, untapped products.",
    cta: { label: "Start Selling in US & CA", href: "/pricing" },
    suppliers: [{ src: "/logos/walmart.svg", alt: "Walmart" }],
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

  // vertical positions for 1-3 supplier cards, centred against the eBay node
  const positions =
    slide.suppliers.length === 1
      ? ["73px"]
      : slide.suppliers.length === 2
      ? ["40px", "106px"]
      : ["16px", "76px", "136px"];

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 overflow-hidden grid-bg">
      <div className="hero-glow" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div
          className="relative rounded-3xl overflow-hidden hs-shell"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* glow orbs */}
          <div className="hs-orb hs-orb-purple" />
          <div className="hs-orb hs-orb-gold" />

          <div className="relative px-6 sm:px-12 py-12 sm:py-16">
            {/* Headline block */}
            <div key={slide.id} className="text-center mb-10 hs-fade">
              <span className="hs-glass inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] text-[#F59E0B] mb-5">
                {slide.badge}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[30px] sm:text-5xl font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-4">
                {slide.headline}
              </h1>
              <p className="text-[#8b85b1] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                {slide.sub}
              </p>
            </div>

            {/* Wired supplier → eBay visual */}
            <div
              key={slide.id + "-viz"}
              className="relative mx-auto hs-fade"
              style={{ maxWidth: 620, height: 200 }}
            >
              <svg
                viewBox="0 0 620 200"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hs-wire" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                {positions.map((_, i) => {
                  const y =
                    positions.length === 1
                      ? 100
                      : positions.length === 2
                      ? [67, 133][i]
                      : [43, 100, 157][i];
                  return (
                    <path
                      key={i}
                      d={`M170 ${y} C 300 ${y}, 330 100, 440 100`}
                      fill="none"
                      stroke="url(#hs-wire)"
                      strokeWidth="2.5"
                      strokeDasharray="7 7"
                      className="hs-dash"
                      style={{ animationDuration: `${2.2 + i * 0.3}s` }}
                    />
                  );
                })}
                <circle cx="440" cy="100" r="5" fill="#F59E0B" />
              </svg>

              {/* supplier cards */}
              {slide.suppliers.map((s, i) => (
                <SupplierCard
                  key={s.alt}
                  src={s.src}
                  alt={s.alt}
                  white={s.white}
                  delay={`${i * 0.5}s`}
                  top={positions[i]}
                />
              ))}

              {/* eBay node */}
              <div
                className="hs-glass hs-pulse"
                style={{
                  position: "absolute",
                  top: 54,
                  right: 0,
                  width: 120,
                  borderRadius: 18,
                  padding: "20px 14px",
                  textAlign: "center",
                  boxShadow:
                    "0 22px 55px -8px rgba(245,158,11,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/ebay.svg"
                  alt="eBay"
                  style={{ height: 26, width: "auto", margin: "0 auto" }}
                />
                <div className="text-[9px] text-[#8b85b1] mt-1.5 tracking-wide">
                  YOU SELL HERE
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10 hs-fade" key={slide.id + "-cta"}>
              <Link
                href={slide.cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-base pulse-glow"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #9333EA)",
                  boxShadow: "0 8px 30px rgba(124,58,237,0.5)",
                }}
              >
                {slide.cta.label} <span>→</span>
              </Link>
            </div>
          </div>

          {/* arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur transition z-20"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur transition z-20"
          >
            ›
          </button>

          {/* dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="h-[7px] rounded-full transition-all"
                style={{
                  width: i === current ? 30 : 7,
                  background: i === current ? "#F59E0B" : "rgba(255,255,255,0.3)",
                  boxShadow: i === current ? "0 0 12px rgba(245,158,11,0.7)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hs-shell {
          background:#0f0e1a;
          background-image:linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px);
          background-size:38px 38px;
          border:1px solid rgba(61,53,128,0.4);
        }
        .hs-glass {
          background:rgba(255,255,255,0.055);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,0.15);
          box-shadow:0 16px 40px -12px rgba(124,58,237,0.45),inset 0 1px 0 rgba(255,255,255,0.14);
        }
        .hs-gradient {
          background:linear-gradient(90deg,#A78BFA,#F59E0B,#A78BFA);
          background-size:200% auto;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:hs-grad 4s ease infinite;
        }
        .hs-orb{position:absolute;border-radius:50%;filter:blur(45px);pointer-events:none;}
        .hs-orb-purple{top:-90px;left:10%;width:340px;height:340px;background:radial-gradient(circle,rgba(124,58,237,0.4),transparent 70%);}
        .hs-orb-gold{bottom:-110px;right:8%;width:320px;height:320px;background:radial-gradient(circle,rgba(245,158,11,0.24),transparent 70%);}
        @keyframes hs-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes hs-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes hs-dash{to{stroke-dashoffset:-100}}
        @keyframes hs-pulse{0%,100%{opacity:0.85;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
        @keyframes hs-fadein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .hs-float{animation:hs-float 5s ease-in-out infinite;}
        .hs-dash{animation:hs-dash linear infinite;}
        .hs-pulse{animation:hs-pulse 3s ease-in-out infinite;}
        .hs-fade{animation:hs-fadein 0.5s ease;}
        @media (max-width:640px){
          .hs-shell .grid-bg{background:none;}
        }
      `}</style>
    </section>
  );
}
