"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Term {
  term: string;
  category: "ebay" | "amazon" | "aliexpress" | "shipping" | "tax" | "general";
  definition: string;
  link?: { text: string; href: string };
}

const TERMS: Term[] = [
  // eBay-specific
  { term: "Cassini", category: "ebay", definition: "eBay's search algorithm. Ranks listings based on title relevance, seller performance, conversion rate, and price competitiveness. UnicornDS AI titles are optimized for Cassini." },
  { term: "Final Value Fee (FVF)", category: "ebay", definition: "The main eBay commission, charged when an item sells. Currently 12.8% for most UK categories, lower for electronics and vehicle parts.", link: { text: "Calculate exact FVF", href: "/ebay-fees-calculator" } },
  { term: "GTC (Good 'Til Cancelled)", category: "ebay", definition: "A fixed-price listing format that renews automatically every 30 days. Each renewal counts as a new listing against your free monthly allowance." },
  { term: "Insertion Fee", category: "ebay", definition: "The fee charged to list an item. UK private sellers get 1,000 free listings per month. Above that, £0.35 per listing." },
  { term: "Item Specifics", category: "ebay", definition: "Structured product details (brand, model, colour, size, etc.) that help eBay categorise and rank your listing. More specifics = better Cassini ranking." },
  { term: "MC011", category: "ebay", definition: "An eBay buyer protection case opened against you when the buyer claims item not received or significantly not as described. Resolve fast to protect your seller metrics." },
  { term: "MSKU", category: "ebay", definition: "Multi-Variation SKU. A single listing with multiple options like size or colour. Each variation has its own SKU. UnicornDS Empire includes an MSKU builder." },
  { term: "Promoted Listings", category: "ebay", definition: "Paid eBay ads. You set an ad rate (e.g. 3-5%). eBay charges only when someone clicks your ad and buys. Useful for new sellers without sales history." },
  { term: "Regulatory Operating Fee", category: "ebay", definition: "0.35% fee on every UK sale, introduced April 2024 to cover eBay's regulatory compliance costs." },
  { term: "Seller Standards", category: "ebay", definition: "eBay's performance scorecard. Above Standard, Top Rated, or Below Standard. Top Rated Sellers get 10% off the FVF." },
  { term: "TRS (Top Rated Seller)", category: "ebay", definition: "eBay's highest seller tier. Requires <0.5% defect rate, <3% late shipments, >100 transactions/year, >£1,000 sales/year. Gives 10% FVF discount." },
  { term: "VERO (Verified Rights Owner)", category: "ebay", definition: "eBay's program that protects brand IP. 3,629 brands currently restricted. Listing them = instant suspension. UnicornDS auto-checks every listing." },
  { term: "Defect Rate", category: "ebay", definition: "Percentage of orders with issues (cancellations, late shipments, cases). Must stay below 2% to avoid being marked Below Standard." },
  { term: "Buyer Protection Fee (BPF)", category: "ebay", definition: "Fee paid by the BUYER (not seller) on UK private sales. Tiered by item value. Seller still receives 100% of listed price." },

  // Amazon
  { term: "Amazon Arbitrage", category: "amazon", definition: "Buying products from Amazon at retail price and reselling on eBay at a markup. Works because eBay buyers often don't comparison shop on Amazon." },
  { term: "Amazon Prime", category: "amazon", definition: "1-2 day free delivery service. Key for dropshipping — your buyer gets fast shipping while you pay no shipping cost." },
  { term: "ASIN", category: "amazon", definition: "Amazon Standard Identification Number. Unique 10-character code for every Amazon product. UnicornDS uses ASINs to track variants and pricing." },
  { term: "Buy Box", category: "amazon", definition: "The featured offer on an Amazon product page (the 'Add to Cart' seller). For dropshipping, you only source from Buy Box winners for reliability." },
  { term: "FBA (Fulfilled by Amazon)", category: "amazon", definition: "Amazon stores and ships the product. FBA items have faster delivery and fewer cancellations — safer for dropshipping." },
  { term: "FBM (Fulfilled by Merchant)", category: "amazon", definition: "Third-party seller ships directly. Often slower and less reliable than FBA. Avoid for dropshipping where possible." },

  // AliExpress
  { term: "AliExpress Standard Shipping", category: "aliexpress", definition: "Tracked shipping from China, typically 15-30 days to UK/US. Always tracked, generally reliable. Most common dropshipping shipping method." },
  { term: "AliExpress Saver Shipping", category: "aliexpress", definition: "Cheaper but slower (30-60 days). Risky for eBay where buyers expect <30 day delivery." },
  { term: "Choice Day", category: "aliexpress", definition: "AliExpress's weekly promo (Mondays). Free shipping + discounts on selected products. Great for sourcing." },
  { term: "ePacket", category: "aliexpress", definition: "Faster tracked shipping from China to US/UK (10-20 days). No longer available to all destinations but still common for US buyers." },
  { term: "Variation / SKU ID", category: "aliexpress", definition: "Each AliExpress variation has a unique skuId. UnicornDS captures this for accurate auto-ordering of the exact variation your buyer chose." },

  // Shipping
  { term: "DPD", category: "shipping", definition: "UK courier offering same-day, next-day, and economy services. Common for UK-to-UK dropshipping with quick fulfilment." },
  { term: "Royal Mail Tracked 24/48", category: "shipping", definition: "Tracked UK delivery service. Tracked 24 = next day, Tracked 48 = 2-3 days. Cheap but reliable for small items under 2kg." },
  { term: "Late Shipment Rate", category: "shipping", definition: "% of orders dispatched late (after the handling time you promised). Must stay <3% to remain Top Rated." },
  { term: "Tracking Upload", category: "shipping", definition: "Adding tracking number to the order on eBay. Required within handling time to count as 'on time'." },
  { term: "Handling Time", category: "shipping", definition: "Days between sale and dispatch. eBay measures from sale time. Dropshippers should set 2-3 day handling to allow supplier processing." },

  // Tax
  { term: "VAT (Value Added Tax)", category: "tax", definition: "20% UK sales tax. You must register if turnover >£85K/year. eBay charges 20% VAT on top of all fees (reclaimable if VAT registered)." },
  { term: "VAT Threshold", category: "tax", definition: "Currently £85,000/year UK turnover. Cross this and you must register for VAT within 30 days." },
  { term: "Schedule of Goods", category: "tax", definition: "HMRC list of items with reduced or zero VAT (children's clothes, books, food). Important if you sell these categories." },
  { term: "1099-K (US)", category: "tax", definition: "US tax form sent to sellers earning >$600/year on eBay. Since 2024, eBay reports all earnings to IRS." },
  { term: "Schedule C", category: "tax", definition: "US self-employment income form. Where you deduct eBay fees, shipping, COGS to lower your taxable profit." },
  { term: "HMRC Reporting", category: "tax", definition: "Since 2024, eBay reports UK seller earnings to HMRC once you cross 30 sales OR £1,700/year. Don't try to hide it." },

  // General
  { term: "ARPU (Average Revenue Per User)", category: "general", definition: "Average monthly revenue per customer. Used to compare plan values." },
  { term: "COGS (Cost of Goods Sold)", category: "general", definition: "What you paid the supplier for the item, plus shipping cost to you. Direct cost of each unit sold." },
  { term: "Conversion Rate", category: "general", definition: "% of listing views that turn into sales. eBay average is 1-3%. Above 5% is excellent." },
  { term: "Drop Shipping", category: "general", definition: "Selling products you don't hold. When a buyer orders, you forward the order to a supplier who ships directly to the buyer." },
  { term: "Gross Margin", category: "general", definition: "(Revenue − Costs) ÷ Revenue. Excludes platform fees. Useful for comparing products before fees.", link: { text: "Calculate margin", href: "/profit-margin-calculator" } },
  { term: "Hand Lifting", category: "general", definition: "Manually processing orders one by one. The thing UnicornDS automates away." },
  { term: "Net Margin", category: "general", definition: "Profit after ALL costs and fees, divided by revenue. The only margin that matters for your bank account." },
  { term: "Niche", category: "general", definition: "A focused category you sell in (e.g. 'gaming mice' instead of 'all electronics'). Niching helps build expertise and repeat buyers." },
  { term: "Pickup / Sale Velocity", category: "general", definition: "How fast a product sells. Sale velocity is the #1 Cassini ranking factor — listings that sell rank higher." },
  { term: "Product Hunter", category: "general", definition: "Tool for finding products to dropship. UnicornDS Product Hunter scans Amazon by keyword with VERO check, stock check, and demand score." },
  { term: "Repricer", category: "general", definition: "Tool that auto-adjusts your listing price based on competitor changes or supplier price updates." },
  { term: "ROI (Return on Investment)", category: "general", definition: "Net Profit ÷ Total Investment. For dropshipping, usually 50-200% per order. Higher than retail because you don't tie up capital in stock." },
  { term: "SKU (Stock Keeping Unit)", category: "general", definition: "Unique identifier for each product variation. Critical for tracking which supplier variant to order when a buyer purchases." },
  { term: "Stock Checker", category: "general", definition: "Tool that verifies supplier inventory before you list or fulfil. Prevents the worst case: selling something you can't ship." },
  { term: "Turnover", category: "general", definition: "Total revenue. Used for tax thresholds (VAT in UK at £85K). Not the same as profit." },
  { term: "Unit Economics", category: "general", definition: "The profit math on a single sale. If unit economics don't work, scaling makes it worse, not better." },
  { term: "Cost Per Listing", category: "general", definition: "Your monthly subscription cost ÷ number of listings created. UnicornDS Starter = £29.99 ÷ 500 = £0.06 per listing." },
  { term: "Profit per Order", category: "general", definition: "Net profit divided by number of orders. Most successful dropshippers target £3-10 per order." },
  { term: "Refund Rate", category: "general", definition: "% of orders refunded. Industry average 3-5%. Above 8% damages your seller standing." },
  { term: "Feedback Rate", category: "general", definition: "% of buyers who leave positive feedback. Industry average 20-40%. Higher feedback = more Cassini ranking signal." },
  { term: "Cross-Border Trade", category: "general", definition: "Selling to buyers in different countries. UnicornDS supports UK→US, UK→DE, UK→FR, UK→AU, UK→CA international." },
  { term: "Multi-Channel Selling", category: "general", definition: "Selling on multiple platforms (eBay + Etsy + Amazon). Diversifies risk if one platform suspends you." },
  { term: "Dropship Friction", category: "general", definition: "Each manual step that slows down listing or fulfilling. UnicornDS removes friction with bulk listing, auto-order, address auto-fill." },
];

const CATEGORIES = [
  { id: "all", name: "All Terms", emoji: "📚", color: "bg-gradient-to-r from-[#7C3AED] to-[#10B981]" },
  { id: "ebay", name: "eBay", emoji: "🛒", color: "bg-[#10B981]" },
  { id: "amazon", name: "Amazon", emoji: "📦", color: "bg-[#F59E0B]" },
  { id: "aliexpress", name: "AliExpress", emoji: "🚀", color: "bg-red-500" },
  { id: "shipping", name: "Shipping", emoji: "📬", color: "bg-blue-500" },
  { id: "tax", name: "Tax & Legal", emoji: "💷", color: "bg-purple-500" },
  { id: "general", name: "General", emoji: "💡", color: "bg-[#7C3AED]" },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = TERMS;
    if (category !== "all") {
      result = result.filter(t => t.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, category]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "eBay Dropshipping Glossary",
          description: "60+ key eBay dropshipping, Amazon arbitrage, and AliExpress terms explained",
          hasDefinedTerm: TERMS.map(t => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition,
          })),
        }),
      }} />

      <div className="pt-24 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-12">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-sm text-[#A78BFA] font-bold mb-6">
            📖 Free Resource
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-5 leading-tight">
            eBay Dropshipping <span className="text-[#F59E0B]">Glossary</span>
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">
            {TERMS.length}+ essential terms every eBay seller and dropshipper should know. Bookmark this page.
          </p>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="max-w-5xl mx-auto px-6 mb-8">
          <div className="relative mb-5">
            <input
              type="search"
              placeholder="Search terms (e.g. VERO, FBA, Cassini)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1E1B4B] border-2 border-[#3d3580] focus:border-[#7C3AED] text-white rounded-xl pl-12 pr-4 py-4 text-base focus:outline-none transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#a5a0cc]">🔍</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  category === c.id
                    ? `${c.color} text-white shadow-lg`
                    : "bg-[#1E1B4B]/50 text-[#a5a0cc] hover:text-white border border-[#3d3580]/40"
                }`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-[#6b6899] mt-4">
            Showing <strong className="text-white">{filtered.length}</strong> {filtered.length === 1 ? "term" : "terms"}
            {search && ` matching "${search}"`}
          </p>
        </section>

        {/* TERMS */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#a5a0cc]">
              <p className="text-2xl mb-2">😕</p>
              <p>No terms found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-4 text-[#7C3AED] hover:text-white underline">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((t, i) => {
                const cat = CATEGORIES.find(c => c.id === t.category);
                return (
                  <div key={t.term + i} className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl p-5 hover:border-[#7C3AED]/60 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{t.term}</h3>
                      <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cat?.color} text-white opacity-80`}>
                        {cat?.name}
                      </span>
                    </div>
                    <p className="text-sm text-[#a5a0cc] leading-relaxed">{t.definition}</p>
                    {t.link && (
                      <Link href={t.link.href} className="inline-block mt-3 text-xs text-[#10B981] hover:text-white font-bold">
                        {t.link.text} →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#F59E0B]/10 border-2 border-[#F59E0B]/30 rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">🎓 Want to LEARN dropshipping, not just look up terms?</h2>
            <p className="text-[#a5a0cc] mb-6 max-w-xl mx-auto">
              Our 8-module Mastery course teaches you the full system, from your first listing to £10K/month. <strong className="text-[#10B981]">FREE</strong> with Growth or Empire.
            </p>
            <Link href="/courses" className="inline-block px-8 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-base font-extrabold transition-all">
              See What&apos;s Inside →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
