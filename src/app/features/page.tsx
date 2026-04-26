import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Every Tool You Need for eBay Dropshipping',
  description: 'Explore all UnicornDS features: Product Hunter, Bulk Lister, AI Cassini SEO Titles, VERO Protection, Competitor Scanner, Demand Score, Stock Checker, and more.',
  keywords: ['ebay dropshipping features', 'ebay automation tools', 'product research ebay', 'bulk lister ebay', 'ai ebay titles', 'vero protection ebay'],
};

const features = [
  {
    slug: 'product-hunter',
    icon: '🎯',
    title: 'Product Hunter',
    desc: 'Search Amazon by keyword with Demand Score for every product. Check eBay sold data before listing.',
    badge: 'Research',
    color: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  },
  {
    slug: 'bulk-lister',
    icon: '🚀',
    title: 'Bulk Lister',
    desc: 'List hundreds of products automatically. AI titles, descriptions, images, item specifics — all filled for you.',
    badge: 'Automation',
    color: 'bg-[#7C3AED]/15 text-[#A78BFA]',
  },
  {
    slug: 'ai-titles',
    icon: '🤖',
    title: 'Cassini SEO Titles',
    desc: 'GPT-4o generates eBay titles using buyer keywords. Thinks like a buyer, not a Chinese supplier.',
    badge: 'AI',
    color: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  },
  {
    slug: 'vero-protection',
    icon: '🛡️',
    title: 'VERO Protection',
    desc: '3,390 restricted brands checked automatically. Smart accessory detection included.',
    badge: 'Safety',
    color: 'bg-[#10B981]/15 text-[#10B981]',
  },
  {
    slug: 'competitor-scanner',
    icon: '🔍',
    title: 'Competitor Scanner',
    desc: "Enter any eBay seller's username and see their entire product catalog instantly.",
    badge: 'Research',
    color: 'bg-[#3B82F6]/15 text-[#3B82F6]',
  },
  {
    slug: 'demand-score',
    icon: '📊',
    title: 'Demand Score & eBay Sold Check',
    desc: 'Every product scored 0-100. Check eBay sold listings before listing — see sold count, average price, competitors.',
    badge: 'Intelligence',
    color: 'bg-[#EC4899]/15 text-[#EC4899]',
  },
  {
    slug: 'one-click-listing',
    icon: '⚡',
    title: 'One-Click Listing',
    desc: 'See a product on Amazon? One click and it is listed on eBay with AI title, description, and images.',
    badge: 'Speed',
    color: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  },
  {
    slug: 'stock-checker',
    icon: '📦',
    title: 'Stock Checker & Restock',
    desc: 'Verify Amazon stock levels, seller type, Prime status. Inline restock buttons on active listings.',
    badge: 'Monitoring',
    color: 'bg-[#6366F1]/15 text-[#6366F1]',
  },
  {
    slug: 'address-helper',
    icon: '📋',
    title: 'Address Helper & Order Fulfilment',
    desc: 'Auto-capture shipping addresses. One-click auto-fill on AliExpress checkout. Smart order messages.',
    badge: 'Fulfilment',
    color: 'bg-[#14B8A6]/15 text-[#14B8A6]',
  },
  {
    slug: 'image-designer',
    icon: '🎨',
    title: 'Image Designer',
    desc: 'Branded product images with templates, watermarks, and overlays. Professional listings in seconds.',
    badge: 'Design',
    color: 'bg-[#F43F5E]/15 text-[#F43F5E]',
  },
];

export default function FeaturesPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] text-xs font-bold tracking-wide inline-block mb-6">
            Features
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6">
            Every tool you need to<br />dominate eBay
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto">
            From finding products to listing them in bulk to fulfilling orders — UnicornDS handles the entire workflow.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <Link
              key={f.slug}
              href={`/features/${f.slug}`}
              className="group rounded-2xl border border-[#2d2860]/50 bg-[#0d0b1a]/80 p-8 hover:border-[#7C3AED]/40 transition-all hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-5">
                <span className="text-4xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${f.color}`}>{f.badge}</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-2 group-hover:text-[#A78BFA] transition-colors">
                    {f.title}
                  </h2>
                  <p className="text-sm text-[#8b85b1] leading-relaxed">{f.desc}</p>
                  <span className="text-xs text-[#7C3AED] mt-4 inline-block font-semibold group-hover:underline">
                    Learn more &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/signup" className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-semibold transition-colors inline-block">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
