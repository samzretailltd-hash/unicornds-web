"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { AnnouncementBar } from "./AnnouncementBar";

type Item = {
  key: string;
  logo: string;
  name: string;
  title: string;
  price: string;
  profit: string;
};

const ITEMS: Item[] = [
  {
    key: "ali",
    logo: "/logos/aliexpress.svg",
    name: "AliExpress",
    title: "Wireless Earbuds Bluetooth 5.3 ANC Noise Cancelling Black",
    price: "£24.99",
    profit: "+£9.20",
  },
  {
    key: "amz",
    logo: "/logos/amazon.svg",
    name: "Amazon",
    title: "Stainless Steel Soap Dispenser Pump 500ml Kitchen Matte",
    price: "£14.99",
    profit: "+£6.10",
  },
  {
    key: "wmt",
    logo: "/logos/walmart.svg",
    name: "Walmart",
    title: "Self-Watering Plant Pot Set of 3 Indoor Planter Grey",
    price: "£19.99",
    profit: "+£8.40",
  },
];

const CYCLE = 4000;
const TYPE_START = 1900;

function Parcel({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}

export function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % ITEMS.length), CYCLE);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const full = ITEMS[idx].title;
    setTyped("");
    const start = setTimeout(() => {
      let n = 0;
      typeRef.current = setInterval(() => {
        n += 1;
        setTyped(full.slice(0, n));
        if (n >= full.length && typeRef.current) clearInterval(typeRef.current);
      }, 26);
    }, TYPE_START);
    return () => {
      clearTimeout(start);
      if (typeRef.current) clearInterval(typeRef.current);
    };
  }, [idx]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (px - 0.5) * 9, y: (0.5 - py) * 6 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const it = ITEMS[idx];
  const arrived = typed.length > 0;

  return (
    <section className="relative pt-20 sm:pt-24 pb-16 overflow-hidden grid-bg">
      <div className="hero-glow" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnnouncementBar />

        <div className="relative rounded-3xl overflow-hidden hs-shell" style={{ perspective: 1400 }}>
          <div className="hs-orb hs-orb-purple" />
          <div className="hs-orb hs-orb-gold" />

          <div className="relative px-6 sm:px-12 py-12 sm:py-14 z-10">
            <div className="text-center mb-9">
              <span className="hs-glass inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] text-[#F59E0B] mb-5">
                3 SUPPLIERS · ONE TOOL
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[28px] sm:text-5xl font-extrabold leading-[1.08] tracking-[-0.02em] mb-4">
                <span className="text-white">Source winning products.</span>{" "}
                <span className="hs-gradient">List them on eBay.</span>
              </h1>
              <p className="text-[#8b85b1] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Find products on Amazon, AliExpress &amp; Walmart — our AI writes the title, you list on eBay in one click.
              </p>
            </div>

            <div
              ref={stageRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="uds-stage"
              style={{
                transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: "transform .15s ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="hs-glass uds-card">
                <div className="uds-cap">SOURCE</div>
                <div className="uds-plate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img key={it.key} src={it.logo} alt={it.name} className="uds-fade" />
                </div>
                <div className="uds-sub2">{it.name}</div>
              </div>

              <div className="uds-wire2">
                <span className="uds-ai">
                  <span style={{ marginRight: 4 }}>✦</span> AI title
                </span>
                <span className="uds-pkt">
                  <Parcel />
                </span>
              </div>

              <div className="hs-glass uds-card">
                <div className="uds-cap" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>LISTING ON</span>
                  <span className="uds-plate uds-plate-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/ebay.svg" alt="eBay" />
                  </span>
                </div>
                <div className="uds-listing">
                  <div className="uds-thumb"><Parcel size={22} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="uds-title">{typed}<span className="uds-caret" /></div>
                    <div className="uds-row" style={{ opacity: arrived ? 1 : 0 }}>
                      <span className="uds-price">{it.price}</span>
                      <span className="uds-profit">▲ {it.profit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-base pulse-glow"
                style={{ background: "linear-gradient(135deg, #7C3AED, #9333EA)", boxShadow: "0 8px 30px rgba(124,58,237,0.55)" }}
              >
                Start 7-Day Trial — £1 <span>→</span>
              </Link>
              <div className="uds-trust">
                <span>Works with</span>
                {ITEMS.map((m) => (
                  <span key={m.key} className="uds-plate uds-plate-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.logo} alt={m.name} />
                  </span>
                ))}
              </div>
            </div>
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
        .hs-orb{position:absolute;border-radius:50%;filter:blur(50px);pointer-events:none;z-index:0;}
        .hs-orb-purple{top:-100px;left:50%;transform:translateX(-50%);width:520px;height:300px;background:radial-gradient(circle,rgba(124,58,237,0.32),transparent 70%);}
        .hs-orb-gold{bottom:-120px;right:14%;width:300px;height:300px;background:radial-gradient(circle,rgba(245,158,11,0.2),transparent 70%);}
        @keyframes hs-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

        .uds-stage{position:relative;display:flex;align-items:stretch;justify-content:space-between;gap:10px;max-width:540px;margin:0 auto;will-change:transform;}
        .uds-card{flex:0 0 152px;border-radius:16px;padding:12px;text-align:left;}
        .uds-cap{font-size:9px;letter-spacing:.08em;color:#8b88c8;margin-bottom:8px;}
        .uds-plate{background:#fff;border-radius:9px;display:flex;align-items:center;justify-content:center;height:44px;padding:0 12px;box-shadow:0 6px 18px rgba(0,0,0,0.28);}
        .uds-plate img{height:22px;width:auto;max-width:104px;object-fit:contain;display:block;}
        .uds-plate-sm{height:22px;padding:0 6px;border-radius:6px;box-shadow:none;}
        .uds-plate-sm img{height:13px;max-width:60px;}
        .uds-sub2{font-size:11px;color:#cfcaf2;margin-top:8px;font-weight:500;}
        .uds-fade{animation:uds-in .45s ease;}
        @keyframes uds-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

        .uds-wire2{position:relative;flex:1;min-width:54px;align-self:center;height:2px;border-radius:2px;background:linear-gradient(90deg,rgba(167,139,250,.2),rgba(245,158,11,.6),rgba(167,139,250,.2));}
        .uds-pkt{position:absolute;top:50%;left:6px;width:34px;height:34px;margin-top:-17px;border-radius:9px;background:#F59E0B;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(245,158,11,.55);animation:udsTravel 4s ease-in-out infinite;}
        @keyframes udsTravel{0%{left:6px;opacity:0}6%{opacity:1}50%{left:calc(100% - 40px);opacity:1}60%{left:calc(100% - 40px);opacity:0}100%{left:calc(100% - 40px);opacity:0}}
        .uds-ai{position:absolute;top:-30px;left:50%;transform:translateX(-50%) scale(.6);opacity:0;font-size:11px;font-weight:500;color:#1E1B4B;background:#A78BFA;border-radius:20px;padding:3px 10px;white-space:nowrap;animation:udsAi 4s ease-in-out infinite;}
        @keyframes udsAi{0%,22%{opacity:0;transform:translateX(-50%) scale(.6)}30%,45%{opacity:1;transform:translateX(-50%) scale(1)}55%{opacity:0;transform:translateX(-50%) scale(.9)}100%{opacity:0}}

        .uds-listing{display:flex;gap:10px;align-items:flex-start;}
        .uds-thumb{flex:0 0 40px;height:40px;border-radius:9px;background:rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:#A78BFA;}
        .uds-thumb svg{stroke:#A78BFA;}
        .uds-title{font-size:12px;line-height:1.35;color:#efeaff;min-height:34px;}
        .uds-caret{display:inline-block;width:2px;height:12px;background:#F59E0B;margin-left:1px;vertical-align:-1px;animation:uds-blink 1s step-end infinite;}
        @keyframes uds-blink{50%{opacity:0}}
        .uds-row{display:flex;align-items:center;gap:8px;margin-top:5px;transition:opacity .35s;}
        .uds-price{font-size:17px;font-weight:700;color:#fff;}
        .uds-profit{font-size:11px;font-weight:500;color:#34D399;background:rgba(16,185,129,.14);border-radius:6px;padding:2px 7px;}

        .uds-trust{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:18px;font-size:11px;color:#7c77a6;}

        @media (max-width:520px){
          .uds-card{flex-basis:128px;padding:10px;}
          .uds-plate img{max-width:88px;}
          .uds-wire2{min-width:30px;}
        }
      `}</style>
    </section>
  );
}
