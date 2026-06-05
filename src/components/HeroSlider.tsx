"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnnouncementBar } from "./AnnouncementBar";

type Supplier = { src: string; alt: string; white?: boolean };

type Slide = {
  id: string;
  badge: string;
  headline: React.ReactNode;
  sub: string;
  cta: { label: string; href: string };
  suppliers: Supplier[];
};

const SLIDES: Slide[] = [
  {
    id: "three-giants",
    badge: "3 SUPPLIERS · ONE TOOL",
    headline: (
      <>
        <span className="text-white">Source from 3 giants.</span>{" "}
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
        <span className="text-white">Amazon arbitrage,</span>{" "}
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
        <span className="text-white">AliExpress</span>{" "}
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
        <span className="text-white">Now sourcing from</span>{" "}
        <span className="hs-gradient">Walmart.</span>
      </>
    ),
    sub: "Expand to the US & Canada markets with Walmart. Competitive prices, fast domestic shipping, untapped products.",
    cta: { label: "Start Selling in US & CA", href: "/pricing" },
    suppliers: [{ src: "/logos/walmart.svg", alt: "Walmart" }],
  },
];

function centresFor(n: number): number[] {
  if (n === 1) return [120];
  if (n === 2) return [84, 156];
  return [52, 120, 188];
}
function topsFor(n: number): number[] {
  return centresFor(n).map((c) => c - 25);
}

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
  const n = slide.suppliers.length;
  const centres = centresFor(n);
  const tops = topsFor(n);

  const wirePath = (y: number) => `M150 ${y} C 300 ${y}, 350 120, 418 120`;

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 overflow-hidden grid-bg">
      <div className="hero-glow" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnnouncementBar />
        <div
          className="relative rounded-3xl overflow-hidden hs-shell"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hs-orb hs-orb-purple" />
          <div className="hs-orb hs-orb-gold" />

          <div className="relative px-6 sm:px-12 py-12 sm:py-14">
            <div key={slide.id} className="text-center mb-9 hs-fade">
              <span className="hs-glass inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] text-[#F59E0B] mb-5">
                {slide.badge}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[28px] sm:text-5xl font-extrabold leading-[1.08] tracking-[-0.02em] mb-4">
                {slide.headline}
              </h1>
              <p className="text-[#8b85b1] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                {slide.sub}
              </p>
            </div>

            <div
              key={slide.id + "-viz"}
              className="relative mx-auto hs-fade"
              style={{ maxWidth: 560, height: 240 }}
            >
              <svg
                viewBox="0 0 560 240"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="hs-wire"
                    gradientUnits="userSpaceOnUse"
                    x1="150"
                    y1="120"
                    x2="418"
                    y2="120"
                  >
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                    <stop offset="55%" stopColor="#A78BFA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
                  </linearGradient>
                  <filter id="hs-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3.2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g
                  filter="url(#hs-glow)"
                  fill="none"
                  stroke="url(#hs-wire)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                >
                  {centres.map((y, i) => (
                    <path key={i} d={wirePath(y)} />
                  ))}
                </g>

                <g fill="#FBBF24" filter="url(#hs-glow)">
                  {centres.map((y, i) => (
                    <g key={i}>
                      <circle r="3.4">
                        <animateMotion
                          dur={`${1.7 + i * 0.2}s`}
                          repeatCount="indefinite"
                          path={wirePath(y)}
                        />
                      </circle>
                      <circle r="3.4">
                        <animateMotion
                          dur={`${1.7 + i * 0.2}s`}
                          begin={`${0.85 + i * 0.1}s`}
                          repeatCount="indefinite"
                          path={wirePath(y)}
                        />
                      </circle>
                    </g>
                  ))}
                </g>
              </svg>

              {slide.suppliers.map((s, i) => (
                <div
                  key={s.alt}
                  className="hs-glass hs-float"
                  style={{
                    position: "absolute",
                    top: tops[i],
                    left: 0,
                    width: 150,
                    height: 50,
                    borderRadius: 14,
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.alt}
                    style={{ height: 22, width: "auto" }}
                    className={s.white ? "brightness-0 invert" : ""}
                  />
                </div>
              ))}

              <div
                className="hs-glass hs-pulse"
                style={{
                  position: "absolute",
                  top: 74,
                  right: 0,
                  width: 128,
                  height: 92,
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/ebay.svg" alt="eBay" style={{ height: 26, width: "auto" }} />
                <div className="text-[9px] text-[#a5a0cc] mt-1.5 tracking-wider">
                  YOU SELL HERE
                </div>
              </div>
            </div>

            <div className="text-center mt-9 hs-fade" key={slide.id + "-cta"}>
              <Link
                href={slide.cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-base pulse-glow"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #9333EA)",
                  boxShadow: "0 8px 30px rgba(124,58,237,0.55)",
                }}
              >
                {slide.cta.label} <span>→</span>
              </Link>
            </div>
          </div>

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
        .hs-shell{
          background:#0f0e1a;
          background-image:linear-gradient(rgba(124,58,237,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.06) 1px,transparent 1px);
          background-size:40px 40px;
          border:1px solid rgba(61,53,128,0.4);
        }
        .hs-glass{
          background:rgba(255,255,255,0.06);
          backdrop-filter:blur(16px);
          -webkit-backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.16);
          box-shadow:0 16px 44px -14px rgba(124,58,237,0.5),inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .hs-gradient{
          background:linear-gradient(90deg,#fff,#A78BFA,#F59E0B,#A78BFA,#fff);
          background-size:200% auto;
          -webkit-background-clip:text;background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:hs-grad 5s ease infinite;
        }
        .hs-orb{position:absolute;border-radius:50%;filter:blur(50px);pointer-events:none;}
        .hs-orb-purple{top:-100px;left:50%;transform:translateX(-50%);width:520px;height:300px;background:radial-gradient(circle,rgba(124,58,237,0.32),transparent 70%);}
        .hs-orb-gold{bottom:-120px;right:14%;width:300px;height:300px;background:radial-gradient(circle,rgba(245,158,11,0.2),transparent 70%);}
        @keyframes hs-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes hs-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes hs-pulse{0%,100%{box-shadow:0 22px 55px -8px rgba(245,158,11,0.45),inset 0 1px 0 rgba(255,255,255,0.2),0 0 0 1px rgba(245,158,11,0.25)}50%{box-shadow:0 22px 65px -6px rgba(245,158,11,0.7),inset 0 1px 0 rgba(255,255,255,0.25),0 0 0 1px rgba(245,158,11,0.5)}}
        @keyframes hs-fadein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .hs-float{animation:hs-float 5s ease-in-out infinite;}
        .hs-pulse{animation:hs-pulse 3s ease-in-out infinite;}
        .hs-fade{animation:hs-fadein 0.5s ease;}
      `}</style>
    </section>
  );
}
