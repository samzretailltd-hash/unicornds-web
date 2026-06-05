'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SITE } from "@/lib/constants";
import { PricingSection } from "@/components/PricingSection";
import { HeroSlider } from "@/components/HeroSlider";
import { useGeo } from "@/lib/geo";
import { t } from "@/lib/i18n";
import { AnnouncementBar } from "@/components/AnnouncementBar";

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

  const videoSchema = [
    { id: 'gFoUuILDDSQ', name: 'Bulk List 4 Products on eBay with UnicornDS', description: 'Watch UnicornDS bulk list 4 Amazon products to eBay in under a minute with AI-generated titles and VERO protection.' },
    { id: '8qpd9Dt6jrI', name: 'Spy on eBay Sellers with Competitor Scanner', description: 'UnicornDS Competitor Scanner extracts any eBay seller\'s entire product catalog in seconds.' },
    { id: 'C9-CB3EJldM', name: 'eBay VERO List Protection Explained', description: 'How UnicornDS checks every product against 3,629 VERO-protected brands before listing to prevent account suspension.' },
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

      {/* ════════ HERO (3D wired slider) ════════ */}
      <AnnouncementBar />
      <HeroSlider />

      {/* ════════ PLATFORM LOGOS ════════ */}
      <section className="py-12">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-center text-[11px] text-[#4a4570] uppercase tracking-[0.2em] mb-6 font-medium">Source from &amp; sell on</p>
            <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
              <img src="/logos/amazon.svg" alt="Amazon" className="h-7 sm:h-9 platform-logo" />
              <img src="/logos/aliexpress.svg" alt="AliExpress" className="h-7 sm:h-9 platform-logo" />
              <img src="/logos/walmart.svg" alt="Walmart" className="h-7 sm:h-9 platform-logo" />
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
                  <AnimatedCounter end={3629} suffix="" />
                </div>
                <div className="text-xs text-[#8b85b1] uppercase tracking-wider">{t('stats.vero', l)}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" />

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
              { icon: "📦", title: t('feat.orderMgr', l), desc: t('feat.orderMgr.desc', l), highlight: true },
              { icon: "🚀", title: t('feat.bulkFulfill', l), desc: t('feat.bulkFulfill.desc', l), highlight: true },
              { icon: "⭐", title: t('feat.repeatBuyer', l), desc: t('feat.repeatBuyer.desc', l), highlight: true },
              { icon: "📊", title: t('feat.demand', l), desc: t('feat.demand.desc', l) },
              { icon: "🏷️", title: t('feat.ebaySales', l), desc: t('feat.ebaySales.desc', l) },
              { icon: "💰", title: t('feat.priceBar', l), desc: t('feat.priceBar.desc', l) },
              { icon: "🛡️", title: t('feat.vero', l), desc: t('feat.vero.desc', l) },
              { icon: "📋", title: t('feat.address', l), desc: t('feat.address.desc', l) },
              { icon: "🔍", title: t('feat.checkEbay', l), desc: t('feat.checkEbay.desc', l) },
              { icon: "💬", title: t('feat.orderMsg', l), desc: t('feat.orderMsg.desc', l) },
              { icon: "🔄", title: t('feat.restock', l), desc: t('feat.restock.desc', l) },
              { icon: "📦", title: t('feat.stock', l), desc: t('feat.stock.desc', l) },
            ].map((f, i) => (
              <Reveal key={f.title} delay={0.1 * i}>
                <div className={`bento-card p-6 h-full ${(f as any).highlight ? 'border-[#F59E0B]/40 border-2' : ''}`}>
                  <span className="text-2xl mb-3 block">{f.icon}</span>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-white mb-2">
                    {f.title}
                    {(f as any).highlight && <span className="ml-2 px-2 py-0.5 text-[9px] font-extrabold bg-[#F59E0B] text-[#1E1B4B] rounded-full align-middle">NEW</span>}
                  </h3>
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

      {/* ════════ TESTIMONIALS ════════ */}
      <section id="testimonials" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="tag-pill bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#FBBF24] mb-5 inline-block">
                ★★★★★ Loved by Sellers
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.02em] mb-3">
                What Our Sellers Say
              </h2>
              <p className="text-[#8b85b1]">Real quotes from real UnicornDS users — full names hidden for privacy</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "Listed 200 products in one weekend. My eBay store hit £1,200 in week 2. The Bulk Lister alone is worth the £29.99.",
                name: "James M.",
                role: "Starter plan · UK",
                tier: "starter",
                avatar: "JM",
                stars: 5,
                metric: "£1,200 in week 2",
              },
              {
                quote: "I tried EcomSniper for a month at $199 and switched to UnicornDS Growth at £59.99. Same features, AliExpress support, way cheaper. No regrets.",
                name: "Sarah K.",
                role: "Growth plan · UK",
                tier: "growth",
                avatar: "SK",
                stars: 5,
                metric: "Saved £140/mo",
              },
              {
                quote: "The MSKU builder is incredible. I list shoes with 15 variations in 90 seconds. Used to take me an hour each. Empire pays for itself in time alone.",
                name: "Mike T.",
                role: "Empire plan · US",
                tier: "empire",
                avatar: "MT",
                stars: 5,
                metric: "60x faster listings",
              },
              {
                quote: "VERO checker saved my main eBay account. Caught 3 brands I would have listed by mistake. That's a suspension avoided right there.",
                name: "Priya R.",
                role: "Growth plan · UK",
                tier: "growth",
                avatar: "PR",
                stars: 5,
                metric: "0 VERO strikes",
              },
              {
                quote: "Switched from manual Amazon arbitrage to UnicornDS. £4,200 sales in my first 60 days. The Cassini AI titles really do rank better.",
                name: "Tom B.",
                role: "Empire plan · UK",
                tier: "empire",
                avatar: "TB",
                stars: 5,
                metric: "£4,200 in 60 days",
              },
              {
                quote: "Started as a side hustle. 4 months later it pays my rent. The 7-day trial for £1 was the lowest-risk thing I ever bought.",
                name: "Emma L.",
                role: "Growth plan · UK",
                tier: "growth",
                avatar: "EL",
                stars: 5,
                metric: "Pays my rent",
              },
            ].map((tm, i) => {
              const tierColor = tm.tier === "empire" ? "text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/30" :
                                tm.tier === "growth" ? "text-[#A78BFA] bg-[#7C3AED]/15 border-[#7C3AED]/30" :
                                "text-[#34D399] bg-[#10B981]/15 border-[#10B981]/30";
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bento-card p-6 h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3 text-[#F59E0B] text-base">
                      {Array.from({ length: tm.stars }).map((_, j) => <span key={j}>★</span>)}
                    </div>
                    {/* Quote */}
                    <p className="text-[#c4c0e0] text-[15px] leading-relaxed mb-4 flex-grow">
                      &ldquo;{tm.quote}&rdquo;
                    </p>
                    {/* Metric badge */}
                    <div className={`inline-block self-start px-3 py-1 rounded-full text-[11px] font-bold border ${tierColor} mb-4`}>
                      📈 {tm.metric}
                    </div>
                    {/* Person */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#3d3580]/30">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        tm.tier === "empire" ? "bg-gradient-to-br from-[#F59E0B] to-[#D97706]" :
                        tm.tier === "growth" ? "bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]" :
                        "bg-gradient-to-br from-[#10B981] to-[#059669]"
                      }`}>
                        {tm.avatar}
                      </div>
                      <div>
                        <div className="text-white text-sm font-bold">{tm.name}</div>
                        <div className="text-[11px] text-[#8b85b1]">{tm.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Trust strip below testimonials */}
          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2 text-[#a5a0cc] text-sm">
                <span className="text-2xl">⭐</span>
                <span><strong className="text-white">4.8/5</strong> average rating</span>
              </div>
              <div className="hidden sm:block text-[#3d3580]">•</div>
              <div className="flex items-center gap-2 text-[#a5a0cc] text-sm">
                <span className="text-2xl">👥</span>
                <span><strong className="text-white">500+</strong> active sellers</span>
              </div>
              <div className="hidden sm:block text-[#3d3580]">•</div>
              <div className="flex items-center gap-2 text-[#a5a0cc] text-sm">
                <span className="text-2xl">💯</span>
                <span><strong className="text-white">30-day</strong> sales guarantee</span>
              </div>
              <div className="hidden sm:block text-[#3d3580]">•</div>
              <div className="flex items-center gap-2 text-[#a5a0cc] text-sm">
                <span className="text-2xl">🇬🇧</span>
                <span><strong className="text-white">UK-based</strong> support</span>
              </div>
            </div>
          </Reveal>
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
