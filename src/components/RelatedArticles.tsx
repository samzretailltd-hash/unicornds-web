import Link from "next/link";

const ALL_POSTS = [
  { slug: "ebay-variant-images-auto-upload", title: "Auto-Upload Variant Images to eBay", tags: ["feature", "listing", "aliexpress"] },
  { slug: "how-many-listings-per-day-ebay", title: "How Many eBay Listings Per Day?", tags: ["strategy", "volume", "listings"] },
  { slug: "ebay-profit-margins-guide", title: "eBay Profit Margins: 20% to 60%", tags: ["profits", "pricing", "margins"] },
  { slug: "ebay-account-levels-selling-limits", title: "eBay Account Levels & Selling Limits", tags: ["account", "limits", "growth"] },
  { slug: "how-to-start-ebay-dropshipping", title: "How to Start eBay Dropshipping 2026", tags: ["beginner", "getting-started", "dropshipping"] },
  { slug: "amazon-to-ebay-arbitrage", title: "Amazon to eBay Arbitrage Guide", tags: ["amazon", "arbitrage", "guide"] },
  { slug: "aliexpress-to-ebay-dropshipping", title: "AliExpress to eBay Dropshipping", tags: ["aliexpress", "sourcing", "dropshipping"] },
  { slug: "best-ebay-listing-tools-2026", title: "Best eBay Listing Tools 2026", tags: ["tools", "comparison", "listing"] },
  { slug: "ebay-vero-list-2026", title: "eBay VERO List: 3,357 Brands", tags: ["vero", "compliance", "brands"] },
  { slug: "ebay-dropshipping-mistakes-to-avoid", title: "15 eBay Dropshipping Mistakes", tags: ["mistakes", "beginner", "account"] },
  { slug: "ebay-seo-title-optimization", title: "eBay Title Optimization for SEO", tags: ["seo", "titles", "listing"] },
  { slug: "how-to-price-products-ebay", title: "eBay Pricing Strategy Guide", tags: ["pricing", "profits", "fees"] },
  { slug: "ebay-shipping-guide-uk", title: "eBay Shipping Guide UK", tags: ["shipping", "uk", "logistics"] },
  { slug: "ebay-vs-amazon-selling", title: "eBay vs Amazon: Which is Better?", tags: ["comparison", "amazon", "platform"] },
  { slug: "unicornds-vs-autods", title: "UnicornDS vs AutoDS", tags: ["comparison", "tools", "autods"] },
  { slug: "unicornds-vs-ecomsniper", title: "UnicornDS vs EcomSniper", tags: ["comparison", "tools", "ecomsniper"] },
  { slug: "how-to-dropship-ebay-usa", title: "Dropship on eBay USA Guide", tags: ["usa", "beginner", "dropshipping"] },
  { slug: "amazon-prime-ebay-arbitrage-usa", title: "Amazon Prime to eBay USA", tags: ["usa", "amazon", "arbitrage"] },
  { slug: "best-ebay-tools-us-sellers", title: "Best eBay Seller Tools 2026", tags: ["tools", "comparison", "listing", "usa"] },
  { slug: "best-ebay-competitor-research-tools", title: "Best eBay Competitor Research Tools", tags: ["tools", "comparison", "listing", "research"] },
  { slug: "best-ai-listing-tool-ebay", title: "Best AI Listing Tool for eBay", tags: ["tools", "listing", "seo", "ai"] },
  { slug: "ebay-seller-tools-comparison", title: "eBay Seller Tools Comparison 2026", tags: ["tools", "comparison", "listing"] },
  { slug: "ebay-dropshipping-australia", title: "eBay Dropshipping Australia Guide", tags: ["dropshipping", "beginner", "tools"] },
  { slug: "ebay-dropshipping-canada", title: "eBay Dropshipping Canada Guide", tags: ["dropshipping", "beginner", "amazon"] },
  { slug: "ebay-dropshipping-germany-guide", title: "eBay Dropshipping Germany Guide", tags: ["dropshipping", "beginner", "tools"] },
  { slug: "ebay-bulk-lister-chrome-extension", title: "eBay Bulk Lister Chrome Extension", tags: ["tools", "listing", "feature"] },
  { slug: "ebay-vero-checker-tool", title: "eBay VERO Checker Tool", tags: ["vero", "compliance", "tools"] },
  { slug: "ebay-auto-lister-free", title: "eBay Auto Lister Free", tags: ["tools", "listing", "beginner"] },
  { slug: "ebay-dropshipping-france", title: "eBay Dropshipping France Guide", tags: ["dropshipping", "beginner", "tools"] },
  { slug: "ebay-dropshipping-spain-italy", title: "eBay Dropshipping Spain & Italy", tags: ["dropshipping", "beginner", "tools"] },
  { slug: "ebay-dropshipping-netherlands", title: "eBay Dropshipping Netherlands", tags: ["dropshipping", "beginner", "tools"] },
  { slug: "how-to-increase-ebay-selling-limits", title: "Increase eBay Selling Limits", tags: ["account", "growth", "beginner"] },
  { slug: "ebay-promoted-listings-strategy", title: "eBay Promoted Listings Strategy", tags: ["strategy", "pricing", "profits"] },
  { slug: "ebay-fees-calculator-2026", title: "eBay Fees Calculator 2026", tags: ["pricing", "profits", "fees"] },
  { slug: "autods-vs-zik-analytics", title: "AutoDS vs ZIK Analytics", tags: ["comparison", "tools", "autods"] },
  { slug: "how-to-avoid-ebay-account-suspension", title: "Avoid eBay Account Suspension", tags: ["compliance", "vero", "account"] },
  { slug: "chrome-extensions-ebay-sellers", title: "Chrome Extensions for eBay Sellers", tags: ["tools", "comparison", "listing"] },
  { slug: "ebay-dropshipping-suppliers-2026", title: "eBay Dropshipping Suppliers 2026", tags: ["sourcing", "dropshipping", "amazon"] },
];

export function RelatedArticles({ currentSlug, tags }: { currentSlug: string; tags: string[] }) {
  const related = ALL_POSTS
    .filter(p => p.slug !== currentSlug)
    .map(p => ({ ...p, score: p.tags.filter(t => tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <div className="mt-16 pt-10 border-t border-[#3d3580]/30">
      <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block p-4 rounded-xl border border-[#3d3580]/40 bg-[#1E1B4B]/30 hover:border-[#7C3AED]/60 transition-all">
            <p className="text-sm font-semibold text-white hover:text-[#A78BFA]">{p.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
