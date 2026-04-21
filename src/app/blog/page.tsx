import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — eBay Dropshipping & Amazon Arbitrage Tips | UnicornDS",
  description: "Learn how to start and scale your eBay dropshipping business. Guides on Amazon arbitrage, AliExpress sourcing, VERO compliance, listing volume, profit margins, and account growth.",
};

const POSTS = [
  { slug: "ebay-variant-images-auto-upload", title: "Auto-Upload Variant Images to eBay — Only UnicornDS Does This", excerpt: "UnicornDS automatically uploads the correct product photo for each colour variant. No other eBay listing tool offers this feature.", date: "11 April 2026", readTime: "5 min", tag: "Feature", color: "#7C3AED" },
  { slug: "ebay-address-helper-aliexpress", title: "eBay Address Helper: Auto-Fill AliExpress Checkout in Seconds", excerpt: "Capture shipping addresses from eBay, Amazon, TikTok. One-click auto-fill on AliExpress checkout. Save an hour per day.", date: "11 April 2026", readTime: "5 min", tag: "Feature", color: "#7C3AED" },
  { slug: "ebay-auto-lister-free", title: "eBay Auto Lister Free: List Products Automatically Without Paying", excerpt: "Start listing on eBay automatically with a free auto lister. AI titles, image upload, VERO protection — all free.", date: "11 April 2026", readTime: "6 min", tag: "Tools", color: "#10B981" },
  { slug: "ebay-vero-checker-tool", title: "eBay VERO Checker Tool: Check 3,357 Restricted Brands Instantly", excerpt: "Free built-in VERO checker. Automatically checks every product against 3,357 restricted brands before you list.", date: "11 April 2026", readTime: "7 min", tag: "Compliance", color: "#EF4444" },
  { slug: "ebay-bulk-lister-chrome-extension", title: "eBay Bulk Lister Chrome Extension: List 100+ Products Per Day", excerpt: "The best Chrome extension for bulk listing on eBay. AI titles, VERO protection, per-variant images, 17 marketplaces.", date: "11 April 2026", readTime: "8 min", tag: "Tools", color: "#7C3AED" },
  { slug: "ebay-dropshipping-australia", title: "eBay Dropshipping Australia: Complete Guide for ebay.com.au", excerpt: "How to start dropshipping on eBay Australia. Products, shipping, GST, and the best tools for ebay.com.au sellers.", date: "11 April 2026", readTime: "12 min", tag: "Australia", color: "#3B82F6" },
  { slug: "ebay-dropshipping-canada", title: "eBay Dropshipping Canada: How to Sell on ebay.ca in 2026", excerpt: "Complete guide to dropshipping on eBay Canada. Amazon.ca sourcing, shipping, taxes, and tools for Canadian sellers.", date: "11 April 2026", readTime: "11 min", tag: "Canada", color: "#EF4444" },
  { slug: "ebay-dropshipping-germany-guide", title: "eBay Dropshipping Germany: How to Sell on ebay.de in 2026", excerpt: "Europe's biggest eBay market. Product research, German buyer expectations, VAT, and automation tools for ebay.de.", date: "11 April 2026", readTime: "12 min", tag: "Germany", color: "#F59E0B" },
  { slug: "ebay-dropshipping-france", title: "eBay Dropshipping France: Guide for ebay.fr Sellers", excerpt: "France's untapped eBay market. 8 million buyers, low competition, and higher margins than the UK.", date: "11 April 2026", readTime: "10 min", tag: "France", color: "#3B82F6" },
  { slug: "ebay-dropshipping-spain-italy", title: "eBay Dropshipping Spain & Italy: ebay.es and ebay.it Guide", excerpt: "Two fast-growing European markets most sellers ignore. Low competition, growing buyer bases, high margins.", date: "11 April 2026", readTime: "10 min", tag: "Europe", color: "#F59E0B" },
  { slug: "ebay-dropshipping-netherlands", title: "eBay Dropshipping Netherlands: How to Sell on ebay.nl", excerpt: "Small market, big opportunity. English-friendly buyers, low competition, and easy entry for new sellers.", date: "11 April 2026", readTime: "8 min", tag: "Netherlands", color: "#F59E0B" },
  { slug: "how-to-increase-ebay-selling-limits", title: "How to Increase eBay Selling Limits: 10 to 10,000+", excerpt: "Step-by-step guide to getting higher selling limits. What to say when you call eBay and the timeline from new to unlimited.", date: "11 April 2026", readTime: "10 min", tag: "Account Growth", color: "#10B981" },
  { slug: "ebay-promoted-listings-strategy", title: "eBay Promoted Listings Strategy 2026: Complete Guide", excerpt: "The right ad rate, when to use standard vs advanced, and how to calculate true profit after advertising costs.", date: "11 April 2026", readTime: "10 min", tag: "Marketing", color: "#F59E0B" },
  { slug: "ebay-fees-calculator-2026", title: "eBay Fees Calculator 2026: Know Your True Profit", excerpt: "Complete breakdown of eBay fees. Final value fees, promoted listings, and the formula to calculate real profit per sale.", date: "11 April 2026", readTime: "8 min", tag: "Pricing", color: "#F59E0B" },
  { slug: "autods-vs-zik-analytics", title: "AutoDS vs ZIK Analytics 2026: Which Should You Choose?", excerpt: "AutoDS does automation, ZIK does research. Neither does both. Here's a tool that does — for less money.", date: "11 April 2026", readTime: "10 min", tag: "Comparison", color: "#8B5CF6" },
  { slug: "how-to-avoid-ebay-account-suspension", title: "How to Avoid eBay Account Suspension: 10 Rules", excerpt: "The 10 most common causes of eBay bans and how to avoid them. VERO strikes, late shipments, policy violations.", date: "11 April 2026", readTime: "12 min", tag: "Compliance", color: "#EF4444" },
  { slug: "chrome-extensions-ebay-sellers", title: "Best Chrome Extensions for eBay Sellers 2026: Top 7", excerpt: "Product research, listing automation, repricing, and analytics. Seven Chrome extensions compared.", date: "11 April 2026", readTime: "10 min", tag: "Tools", color: "#7C3AED" },
  { slug: "ebay-dropshipping-suppliers-2026", title: "eBay Dropshipping Suppliers 2026: Complete Comparison", excerpt: "Amazon, AliExpress, CJ Dropshipping, Walmart — pros, cons, margins, and which to use when.", date: "11 April 2026", readTime: "12 min", tag: "Sourcing", color: "#10B981" },
  { slug: "how-many-listings-per-day-ebay", title: "How Many eBay Listings Per Day Do You Need? The Volume Formula", excerpt: "The exact listing volumes needed for 5, 10, 20, and 50+ sales per day. Real numbers showing how listings compound into income.", date: "8 April 2026", readTime: "10 min", tag: "Strategy", color: "#F59E0B" },
  { slug: "ebay-profit-margins-guide", title: "eBay Profit Margins: From 20% to 60% — How to Scale", excerpt: "How your margins grow from 15% beginner to 60% expert as your account matures. Real progression timeline with numbers.", date: "8 April 2026", readTime: "12 min", tag: "Profits", color: "#10B981" },
  { slug: "ebay-account-levels-selling-limits", title: "eBay Account Levels: How Seniority Controls Your Income", excerpt: "Your account age affects selling limits, search ranking, and fees. The 4 stages from new seller to Top Rated and what each unlocks.", date: "8 April 2026", readTime: "11 min", tag: "Account Growth", color: "#F59E0B" },
  { slug: "how-to-start-ebay-dropshipping", title: "How to Start eBay Dropshipping in 2026: Beginner's Guide", excerpt: "Everything you need to know about starting an eBay dropshipping business. From account setup to making your first sale.", date: "8 April 2026", readTime: "15 min", tag: "Getting Started", color: "#10B981" },
  { slug: "amazon-to-ebay-arbitrage", title: "Amazon to eBay Arbitrage: Complete Step-by-Step Guide", excerpt: "Buy from Amazon, sell on eBay for profit. Covers product research, pricing, listing, and scaling to 1000+ active listings.", date: "8 April 2026", readTime: "12 min", tag: "Guide", color: "#7C3AED" },
  { slug: "aliexpress-to-ebay-dropshipping", title: "AliExpress to eBay Dropshipping: The High-Margin Strategy", excerpt: "How to source from AliExpress for 40-60% margins. Product categories, shipping management, and the hybrid strategy.", date: "8 April 2026", readTime: "12 min", tag: "Sourcing", color: "#10B981" },
  { slug: "best-ebay-listing-tools-2026", title: "Best eBay Listing Tools 2026: Complete Comparison", excerpt: "Compare UnicornDS, EcomSniper, AutoDS and more. Features, pricing, and honest verdicts on which tool is right for you.", date: "8 April 2026", readTime: "10 min", tag: "Tools", color: "#7C3AED" },
  { slug: "ebay-vero-list-2026", title: "eBay VERO List 2026: 3,357 Brands You Cannot Sell", excerpt: "The complete VERO brand list. Avoid account suspension by checking this list before listing any product.", date: "8 April 2026", readTime: "8 min", tag: "Compliance", color: "#EF4444" },
  { slug: "ebay-dropshipping-mistakes-to-avoid", title: "15 eBay Dropshipping Mistakes That Kill Your Account", excerpt: "The 15 most common mistakes that lead to account suspension, lost profits, and wasted time. Learn from sellers who failed.", date: "10 April 2026", readTime: "12 min", tag: "Mistakes", color: "#EF4444" },
  { slug: "ebay-seo-title-optimization", title: "eBay Title Optimization: How to Write Titles That Rank #1", excerpt: "The 80-character formula top sellers use. Real examples showing bad vs good titles and the 8 rules that boost search ranking.", date: "10 April 2026", readTime: "10 min", tag: "SEO", color: "#3B82F6" },
  { slug: "how-to-price-products-ebay", title: "eBay Pricing Strategy: How to Price for Maximum Profit", excerpt: "The exact formula that accounts for eBay fees, shipping, ad costs, and profit margin. Stop losing money on every sale.", date: "10 April 2026", readTime: "10 min", tag: "Pricing", color: "#F59E0B" },
  { slug: "ebay-shipping-guide-uk", title: "eBay Shipping Guide: Best Carriers & Settings for UK Sellers", excerpt: "Complete guide to shipping for dropshippers. Amazon vs AliExpress handling times, tracked vs untracked, and free shipping strategy.", date: "10 April 2026", readTime: "8 min", tag: "Shipping", color: "#10B981" },
  { slug: "ebay-vs-amazon-selling", title: "eBay vs Amazon: Which Platform is Better for Sellers in 2026?", excerpt: "Honest comparison of fees, competition, startup costs, and profit potential. Plus the strategy that uses both platforms together.", date: "10 April 2026", readTime: "12 min", tag: "Comparison", color: "#8B5CF6" },
  { slug: "unicornds-vs-autods", title: "UnicornDS vs AutoDS: Which eBay Tool is Better?", excerpt: "Detailed comparison of features, pricing, and approach. Which tool offers better value for Amazon arbitrage and AliExpress dropshipping?", date: "10 April 2026", readTime: "10 min", tag: "Comparison", color: "#8B5CF6" },
  { slug: "unicornds-vs-ecomsniper", title: "UnicornDS vs EcomSniper: Complete 2026 Comparison", excerpt: "Same 3,000 listings, 36% cheaper. Plus AI titles, Stock Checker, and Order Manager that EcomSniper lacks.", date: "10 April 2026", readTime: "10 min", tag: "Comparison", color: "#8B5CF6" },
  { slug: "how-to-dropship-ebay-usa", title: "How to Dropship on eBay in the USA: Complete Guide", excerpt: "Step-by-step guide for American sellers. Amazon.com sourcing, US tax, USPS shipping, and scaling to $3,000/month.", date: "10 April 2026", readTime: "15 min", tag: "USA", color: "#3B82F6" },
  { slug: "amazon-prime-ebay-arbitrage-usa", title: "Amazon Prime to eBay Arbitrage USA: $3,000/Month", excerpt: "The exact system to buy from Amazon with Prime and sell on eBay for profit. Real numbers and scaling strategy.", date: "10 April 2026", readTime: "14 min", tag: "USA", color: "#F59E0B" },
  { slug: "best-ebay-tools-us-sellers", title: "Best eBay Tools for US Sellers 2026: Top 5 Compared", excerpt: "UnicornDS vs AutoDS vs Zik Analytics vs DSM Tool vs SaleFreaks. Honest comparison for American eBay sellers.", date: "10 April 2026", readTime: "12 min", tag: "USA", color: "#7C3AED" },
];

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider mb-4">Blog</span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-3">eBay Selling Guides & Tips</h1>
          <p className="text-[#a5a0cc]">Learn how to find, list, and sell products on eBay profitably.</p>
        </div>
        <div className="space-y-5">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: post.color + "15", color: post.color }}>{post.tag}</span>
                <span className="text-xs text-[#6b6899]">{post.date}</span>
                <span className="text-xs text-[#6b6899]">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{post.title}</h2>
              <p className="text-sm text-[#a5a0cc] leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
