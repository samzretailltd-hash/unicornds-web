'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import { PricingSection } from "@/components/PricingSection";
import { HeroSlider } from "@/components/HeroSlider";
import { useGeo } from "@/lib/geo";
import { t } from "@/lib/i18n";

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (!inView) return;
    const dur = 2000, steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setCount(Math.round(end * progress));
      if (step >= steps) { clearInterval(timer); setCount(end); }
    }, dur / steps);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref} className="stat-number">{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Section Reveal ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Bento Card ─── */
function BentoCard({ title, desc, screenshot, icon, wide = false, delay = 0, alt }: {
  title: string; desc: string; screenshot: string; icon: string; wide?: boolean; delay?: number; alt?: string;
}) {
  return (
    <Reveal delay={delay} className={wide ? 'bento-wide' : ''}>
      <div className={`bento-card h-full flex flex-col`}>
        <div className="p-6 pb-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm text-[#8b85b1] leading-relaxed">{desc}</p>
        </div>
        <div className="px-4 pb-4 mt-auto">
          <div className="overflow-hidden rounded-xl">
            <img src={screenshot} alt={alt || title} className="bento-screenshot" loading="lazy" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Main Component ─── */
export function HomeContent() {
  const geo = useGeo();
  const l = geo.language;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  function renderSubtitle(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
    );
  }

  const videoSchema = [
    { id: 'gFoUuILDDSQ', name: 'Bulk List 4 Products on eBay with UnicornDS', description: 'Watch UnicornDS bulk list 4 Amazon products to eBay in under a minute with AI-generated titles and VERO protection.' },
    { id: '8qpd9Dt6jrI', name: 'Spy on eBay Sellers with Competitor Scanner', description: 'UnicornDS Competitor Scanner extracts any eBay seller\'s entire product catalog in seconds.' },
    { id: 'C9-CB3EJldM', name: 'eBay VERO List Protection Explained', description: 'How UnicornDS checks every product against 3,390 VERO-protected brands before listing to prevent account suspension.' },
    { id: 'pfFSKKIlymc', name: 'Create Professional eBay Product Images', description: 'UnicornDS Image Designer adds watermarks and branded overlays to product photos for a consistent eBay store look.' },
    { id: 'qBceu9VeZIA', name: 'AliExpress to eBay — 93% Profit Margin', description: 'Step-by-step AliExpress dropshipping to eBay with UnicornDS showing real margin calculations.' },
  ].map(v => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
    uploadDate: "2026-03-01",
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
  }));

  return (
    <div className="noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      {/* ════════ HERO ════════ */}
      <section ref={heroRef} className="relative pt-36 sm:pt-44 pb-8 text-center overflow-hidden grid-bg">
        <div className="hero-glow" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto px-6 relative">
          {/* Badge */}
          <Reveal>
            <div className="inline-block px-5 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-sm text-[#A78BFA] font-medium mb-8 hero-badge">
              {t('hero.badge', l)}
            </div>
          </Reveal>

          {/* Logo */}
          <Reveal delay={0.05}>
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="UnicornDS" width={80} height={80} className="drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-display)] text-[36px] sm:text-6xl lg:text-[80px] font-extrabold leading-[1.05] mb-6 tracking-[-0.02em]">
              {t('hero.title1', l)}<br />
              <span className="text-gradient-animated">{t('hero.title2', l)}</span>
            </h1>
          </Reveal>

          {/* Subtitle with inline logos */}
          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl text-[#8b85b1] max-w-2xl mx-auto mb-10 leading-relaxed">
              Source from{" "}
              <img src="/logos/amazon.svg" alt="Amazon" className="inline-block h-5 sm:h-6 align-middle mx-1 brightness-0 invert" />{" "}
              for fast delivery or{" "}
              <img src="/logos/aliexpress.svg" alt="AliExpress" className="inline-block h-5 sm:h-6 align-middle mx-1 brightness-0 invert" />{" "}
              for maximum margins. List on eBay in seconds with AI-powered automation.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href={SITE.chrome_store} className="btn-primary px-8 py-4 rounded-2xl text-base font-bold pulse-glow">
                {t('hero.cta', l)}
              </Link>
              <Link href="/#features" className="btn-outline px-8 py-4 rounded-2xl text-base font-semibold">
                {t('hero.cta2', l)}
              </Link>
            </div>
            <p className="mt-5 text-sm text-[#4a4570]">{t('hero.free', l)}</p>
          </Reveal>
        </motion.div>

        {/* Hero Screenshot */}
        <Reveal delay={0.5}>
          <div className="max-w-5xl mx-auto px-6 mt-16">
            <div className="hero-screenshot-wrapper">
              <img
                src="/screenshots/overlay.png"
                alt="UnicornDS Chrome Extension in action on AliExpress"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ PLATFORM LOGOS ════════ */}
      <section className="py-12">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-center text-[11px] text-[#4a4570] uppercase tracking-[0.2em] mb-6 font-medium">Source from & sell on</p>
            <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
              <img src="/logos/amazon.svg" alt="Amazon" className="h-7 sm:h-9 platform-logo" />
              <img src="/logos/aliexpress.svg" alt="AliExpress" className="h-7 sm:h-9 platform-logo" />
              <span className="text-xl text-[#2d2766]">→</span>
              <img src="/logos/ebay.svg" alt="eBay" className="h-7 sm:h-9 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

      {/* ════════ STATS RIBBON ════════ */}
      <section className="py-16">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6">
            <div className="stats-grid">
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={50000} suffix="+" />
                </div>
                <div className="text-xs text-[#8b85b1] uppercase tracking-wider">{t('stats.listed', l)}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <div className="text-xs text-[#8b85b1] uppercase tracking-wider">{t('stats.researched', l)}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-xs text-[#8b85b1] uppercase tracking-wider">{t('stats.sellers', l)}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter end={3390} suffix="" />
                </div>
                <div className="text-xs text-[#8b85b1] uppercase tracking-wider">{t('stats.vero', l)}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ TRUST SLIDER — VERO, Privacy, Data Safety ════════ */}
      <div className="section-divider" />
      <HeroSlider />

      {/* ════════ BENTO FEATURES GRID ════════ */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="tag-pill bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] mb-5 inline-block">
                {t('features.badge', l)}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em]">
                {t('features.title', l)}
              </h2>
              <p className="text-[#8b85b1] mt-4 text-lg max-w-xl mx-auto">{t('features.subtitle', l)}</p>
            </div>
          </Reveal>

          <div className="bento-grid">
            {/* Row 1: Product Hunter (wide) + AI Title */}
            <BentoCard
              icon="🎯"
              title={t('feat.hunter', l)}
              desc={t('feat.hunter.desc', l)}
              screenshot="/screenshots/product-hunter.png"
              alt="UnicornDS Product Hunter — search Amazon by keyword for profitable eBay dropshipping products"
              wide={true}
              delay={0}
            />
            <BentoCard
              icon="🤖"
              title={t('feat.ai', l)}
              desc={t('feat.ai.desc', l)}
              screenshot="/screenshots/ai-title.png"
              alt="AI Title Builder generating SEO-optimized eBay listing titles with GPT-4o"
              delay={0.1}
            />

            {/* Row 2: Competitor Scanner + Bulk Lister (wide) */}
            <BentoCard
              icon="👥"
              title={t('feat.scanner', l)}
              desc={t('feat.scanner.desc', l)}
              screenshot="/screenshots/competitor-scanner.png"
              alt="Competitor Scanner extracting any eBay seller's entire product catalog"
              delay={0.15}
            />
            <BentoCard
              icon="⚡"
              title={t('feat.bulk', l)}
              desc={t('feat.bulk.desc', l)}
              screenshot="/screenshots/bulk-lister.png"
              alt="UnicornDS Bulk Lister processing multiple Amazon products to eBay simultaneously"
              wide={true}
              delay={0.2}
            />

            {/* Row 3: Image Designer (wide) + Stock Tracker */}
            <BentoCard
              icon="🖼️"
              title={t('feat.image', l)}
              desc={t('feat.image.desc', l)}
              screenshot="/screenshots/image-designer.png"
              alt="Image Designer adding watermarks and branded overlays to eBay product photos"
              wide={true}
              delay={0.25}
            />
            <BentoCard
              icon="📊"
              title={t('feat.tracker', l)}
              desc={t('feat.tracker.desc', l)}
              screenshot="/screenshots/stock-tracker.png"
              alt="Stock Tracker monitoring Amazon inventory for active eBay listings"
              delay={0.3}
            />
          </div>

          {/* Extra features row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[
              { icon: "📊", title: t('feat.demand', l), desc: t('feat.demand.desc', l) },
              { icon: "🏷️", title: t('feat.ebaySales', l), desc: t('feat.ebaySales.desc', l) },
              { icon: "💰", title: t('feat.priceBar', l), desc: t('feat.priceBar.desc', l) },
              { icon: "🛡️", title: t('feat.vero', l), desc: t('feat.vero.desc', l) },
              { icon: "📦", title: t('feat.stock', l), desc: t('feat.stock.desc', l) },
              { icon: "📋", title: t('feat.address', l), desc: t('feat.address.desc', l) },
              { icon: "🔍", title: t('feat.checkEbay', l), desc: t('feat.checkEbay.desc', l) },
              { icon: "💬", title: t('feat.orderMsg', l), desc: t('feat.orderMsg.desc', l) },
              { icon: "🔄", title: t('feat.restock', l), desc: t('feat.restock.desc', l) },
            ].map((f, i) => (
              <Reveal key={f.title} delay={0.1 * i}>
                <div className="bento-card p-6 h-full">
                  <span className="text-2xl mb-3 block">{f.icon}</span>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[#8b85b1] leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="tag-pill bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] mb-5 inline-block">
                {t('how.badge', l)}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em]">
                {t('how.title', l)}
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-10 relative">
            {['1','2','3'].map((n, i) => (
              <Reveal key={n} delay={i * 0.15}>
                <div className="flex gap-6 items-start relative">
                  {i < 2 && <div className="step-line" />}
                  <div className="step-dot">{n}</div>
                  <div className="pt-2">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-2">
                      {t(`how.${n}.title`, l)}
                    </h3>
                    <p className="text-[#8b85b1] leading-relaxed max-w-lg">
                      {t(`how.${n}.desc`, l)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════ REAL RESULTS ════════ */}
      <section id="results" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="tag-pill bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] mb-5 inline-block">
                Real Results
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-3">
                Our Sellers Are Growing Fast
              </h2>
              <p className="text-[#8b85b1]">Real eBay Seller Hub dashboards — names hidden to protect our sellers</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { img: '/results/seller-a.jpg', summary: '3 months • £4,920 sales • 932 orders' },
              { img: '/results/seller-b.jpg', summary: '4 months • £8,621 sales • 1,462 orders' },
              { img: '/results/seller-c.jpg', summary: '6 months • £16,107 sales • 2,685 orders' },
              { img: '/results/seller-d.jpg', summary: '8 months • £24,126 YTD • 4,000+ orders' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bento-card overflow-hidden">
                  <img src={s.img} alt={'Seller results'} className="w-full" loading="lazy" />
                  <div className="p-4 text-center">
                    <p className="text-sm text-[#8b85b1]">{s.summary}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center text-[#4a4570] text-sm mt-8">All screenshots from real eBay Seller Hub dashboards. Account names anonymised for privacy.</p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════ YOUTUBE DEMOS ════════ */}
      <section id="demos" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="tag-pill bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#FBBF24] mb-5 inline-block">
                See It In Action
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-3">
                Watch UnicornDS Work
              </h2>
              <p className="text-[#8b85b1]">Quick demos showing every feature. Subscribe for weekly tutorials.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: 'gFoUuILDDSQ', title: 'Bulk List 4 Products on eBay', badge: '🚀 Bulk Listing' },
              { id: '8qpd9Dt6jrI', title: 'Spy on eBay Sellers', badge: '👥 Competitor Scanner' },
              { id: 'C9-CB3EJldM', title: 'eBay VERO List Protection', badge: '🛡️ VERO Safety' },
              { id: 'pfFSKKIlymc', title: 'Create Professional Images', badge: '🖼️ Image Designer' },
              { id: 'qBceu9VeZIA', title: 'AliExpress to eBay — 93% Profit', badge: '🌏 AliExpress' },
            ].map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div className="group">
                  <div className="relative rounded-2xl overflow-hidden border border-[#1a1730] hover:border-[#2d2766] transition-all bg-[#0d0c18] aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?rel=0`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <span className="tag-pill bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] text-[10px]">{v.badge}</span>
                    <p className="text-sm text-[#8b85b1] mt-2 font-medium">{v.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <a href="https://www.youtube.com/@Unicornds_io" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF0000]/8 border border-[#FF0000]/20 text-white text-sm font-semibold hover:bg-[#FF0000]/15 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.6c-1 .3-1.7 1.1-2 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2.1 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.6c1-.3 1.7-1.1 2-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                Subscribe on YouTube
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════ PRICING ════════ */}
      <PricingSection />

      <div className="section-divider" />

      {/* ════════ FAQ ════════ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="tag-pill bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] mb-5 inline-block">
                {t('faq.badge', l)}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em]">
                {t('faq.title', l)}
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-3">
            {['1','2','3','4','5'].map((n, i) => (
              <Reveal key={n} delay={i * 0.06}>
                <details className="bento-card rounded-2xl group">
                  <summary className="p-5 cursor-pointer font-semibold text-white text-[15px] flex justify-between items-center">
                    {t(`faq.${n}.q`, l)}
                    <span className="text-[#F59E0B] text-xl transition-transform group-open:rotate-45 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-[#8b85b1] leading-relaxed">{t(`faq.${n}.a`, l)}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════ CTA ════════ */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="hero-glow" style={{ top: '-100px' }} />

        <Reveal>
          <div className="max-w-2xl mx-auto px-6 relative">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-4">
              {t('cta.title', l)}
            </h2>
            <p className="text-[#8b85b1] text-lg mb-8">{t('cta.subtitle', l)}</p>
            <Link href={SITE.chrome_store} className="btn-primary px-10 py-4 rounded-2xl text-base font-bold inline-block pulse-glow">
              {t('cta.button', l)}
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
