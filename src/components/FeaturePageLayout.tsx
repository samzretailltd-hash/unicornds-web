'use client';
import Link from 'next/link';

interface FeatureSection {
  icon: string;
  title: string;
  description: string;
}

interface FeaturePageProps {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  screenshotAlt: string;
  screenshotPlaceholder?: string; // path to screenshot image
  videoId?: string; // YouTube video ID for embed
  sections: FeatureSection[];
  howItWorks: string[];
  ctaText?: string;
}

export function FeaturePageLayout({
  badge, badgeColor, title, subtitle, heroDescription,
  screenshotAlt, screenshotPlaceholder, videoId,
  sections, howItWorks, ctaText
}: FeaturePageProps) {
  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <Link href="/features" className="text-sm text-[#A78BFA] hover:underline mb-6 inline-block">&larr; All Features</Link>
          <div className="mb-6">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${badgeColor}`}>{badge}</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Video or Screenshot placeholder */}
        <div className="rounded-2xl overflow-hidden border border-[#2d2860]/50 bg-[#0d0b1a] aspect-video max-w-4xl mx-auto mb-8">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={screenshotAlt}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : screenshotPlaceholder ? (
            <img src={screenshotPlaceholder} alt={screenshotAlt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-30">🎬</div>
                <p className="text-[#6b6899] text-sm">Video tutorial coming soon</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <p className="text-lg text-[#c4c0e0] leading-relaxed">{heroDescription}</p>
      </section>

      {/* Feature Sections */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#2d2860]/50 bg-[#0d0b1a]/80 p-8 hover:border-[#7C3AED]/40 transition-colors">
              <span className="text-3xl mb-4 block">{s.icon}</span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-[#8b85b1] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white text-center mb-12">How it works</h2>
        <div className="flex flex-col gap-8">
          {howItWorks.map((step, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#A78BFA] font-bold text-sm">
                {i + 1}
              </div>
              <p className="text-[#c4c0e0] leading-relaxed pt-2">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 text-center">
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-gradient-to-br from-[#7C3AED]/10 to-[#1E1B4B]/50 p-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-4">
            {ctaText || 'Ready to try it?'}
          </h2>
          <p className="text-[#a5a0cc] mb-8">Start your free trial — card captured, not charged during trial for the first 7 days.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-semibold transition-colors">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="px-8 py-4 border border-[#2d2860] hover:border-[#7C3AED]/50 text-white rounded-xl font-semibold transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
