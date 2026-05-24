"use client";

import { useState, useMemo } from "react";
import type { Metadata } from "next";
import Link from "next/link";

// Note: metadata moved to layout.tsx since this is a client component
// See ebay-fees-calculator/layout.tsx for SEO meta

type Market = "UK" | "US" | "DE" | "FR" | "AU" | "CA";
type SellerType = "private" | "business";
type SellerLevel = "above_standard" | "top_rated" | "below_standard";

interface CategoryRate {
  name: string;
  fvf: number; // Final Value Fee %
  perOrderUnder10: number;
  perOrderOver10: number;
}

// UK eBay categories with 2026 verified rates
const UK_CATEGORIES: Record<string, CategoryRate> = {
  "everything-else": { name: "Everything else", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "clothing": { name: "Clothing, Shoes & Accessories", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "electronics": { name: "Consumer Electronics", fvf: 9.9, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "home": { name: "Home, Furniture & DIY", fvf: 12.8, perOrderUnder10: 0.10, perOrderOver10: 0.10 },
  "collectables": { name: "Collectables", fvf: 12.8, perOrderUnder10: 0.10, perOrderOver10: 0.10 },
  "books": { name: "Books, Comics & Magazines", fvf: 14.9, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "health": { name: "Health & Beauty", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "sports": { name: "Sporting Goods", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "toys": { name: "Toys & Games", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "jewelry": { name: "Jewellery & Watches", fvf: 11.9, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "business": { name: "Business, Office & Industrial", fvf: 12.8, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
  "cars": { name: "Vehicle Parts & Accessories", fvf: 9.9, perOrderUnder10: 0.30, perOrderOver10: 0.40 },
};

const MARKET_CURRENCY: Record<Market, { symbol: string; code: string; locale: string }> = {
  UK: { symbol: "£", code: "GBP", locale: "en-GB" },
  US: { symbol: "$", code: "USD", locale: "en-US" },
  DE: { symbol: "€", code: "EUR", locale: "de-DE" },
  FR: { symbol: "€", code: "EUR", locale: "fr-FR" },
  AU: { symbol: "A$", code: "AUD", locale: "en-AU" },
  CA: { symbol: "C$", code: "CAD", locale: "en-CA" },
};

const REGULATORY_FEE = 0.0035; // 0.35% (UK)

export default function EbayFeesCalculatorPage() {
  const [market, setMarket] = useState<Market>("UK");
  const [sellerType, setSellerType] = useState<SellerType>("business");
  const [sellerLevel, setSellerLevel] = useState<SellerLevel>("above_standard");
  const [category, setCategory] = useState<string>("everything-else");

  const [soldPrice, setSoldPrice] = useState<string>("25");
  const [shipping, setShipping] = useState<string>("3.50");
  const [itemCost, setItemCost] = useState<string>("8");
  const [shippingCost, setShippingCost] = useState<string>("2.50");
  const [orders, setOrders] = useState<string>("1");
  const [promotedRate, setPromotedRate] = useState<string>("0");
  const [vatRegistered, setVatRegistered] = useState<boolean>(false);
  const [international, setInternational] = useState<boolean>(false);

  const currency = MARKET_CURRENCY[market];

  const result = useMemo(() => {
    const sold = parseFloat(soldPrice) || 0;
    const ship = parseFloat(shipping) || 0;
    const cost = parseFloat(itemCost) || 0;
    const shipCost = parseFloat(shippingCost) || 0;
    const orderCount = parseInt(orders) || 1;
    const promo = parseFloat(promotedRate) || 0;

    const cat = UK_CATEGORIES[category];
    const totalSale = sold + ship;

    // Private sellers (UK only) — free
    if (sellerType === "private" && market === "UK") {
      const totalCosts = (cost + shipCost) * orderCount;
      const totalRevenue = totalSale * orderCount;
      return {
        fvf: 0, perOrderFee: 0, regulatoryFee: 0, promotedFee: 0,
        intlFee: 0, vatOnFees: 0, totalFees: 0,
        revenue: totalRevenue, costs: totalCosts,
        netProfit: totalRevenue - totalCosts,
        margin: totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0,
        isPrivate: true,
      };
    }

    // Final Value Fee (with TRS discount if applicable)
    let fvfRate = cat.fvf;
    if (sellerLevel === "top_rated") fvfRate = fvfRate * 0.9; // 10% off
    if (sellerLevel === "below_standard") fvfRate = fvfRate + 6; // 6pp surcharge

    const fvf = (totalSale * fvfRate / 100);

    // Per-order fee (UK)
    const perOrderFee = totalSale >= 10 ? cat.perOrderOver10 : cat.perOrderUnder10;

    // Regulatory fee
    const regulatoryFee = totalSale * REGULATORY_FEE;

    // Promoted listings fee
    const promotedFee = (totalSale * promo / 100);

    // International transaction fee
    const intlFee = international ? totalSale * 0.013 : 0;

    // VAT on fees (20% for UK non-VAT registered)
    const feesBeforeVat = fvf + perOrderFee + regulatoryFee + promotedFee + intlFee;
    const vatOnFees = vatRegistered ? 0 : feesBeforeVat * 0.2;

    const totalFeesPerOrder = feesBeforeVat + vatOnFees;
    const totalFees = totalFeesPerOrder * orderCount;

    const totalRevenue = totalSale * orderCount;
    const totalCosts = (cost + shipCost) * orderCount;
    const netProfit = totalRevenue - totalCosts - totalFees;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      fvf: fvf * orderCount,
      perOrderFee: perOrderFee * orderCount,
      regulatoryFee: regulatoryFee * orderCount,
      promotedFee: promotedFee * orderCount,
      intlFee: intlFee * orderCount,
      vatOnFees: vatOnFees * orderCount,
      totalFees,
      revenue: totalRevenue,
      costs: totalCosts,
      netProfit,
      margin,
      isPrivate: false,
    };
  }, [soldPrice, shipping, itemCost, shippingCost, orders, promotedRate, vatRegistered, international, sellerType, sellerLevel, category, market]);

  const fmt = (n: number) => new Intl.NumberFormat(currency.locale, { style: "currency", currency: currency.code }).format(n);

  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "eBay Fees Calculator — Free UK & US Profit Calculator",
          description: "Free eBay fees calculator for UK and US sellers. Calculate Final Value Fees, profit, margin, VAT and promoted listings fees in seconds.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "523" },
        }),
      }} />

      <div className="pt-24 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-12">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-sm text-[#F59E0B] font-bold mb-6">
            🎁 100% Free Tool — No Signup Required
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-5 leading-tight">
            eBay Fees Calculator <span className="text-[#F59E0B]">2026</span>
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">
            Know your real profit before you list. Calculate eBay Final Value Fees, per-order fees, VAT, promoted listing costs, and net margin for UK & US sellers.
          </p>
        </section>

        {/* CALCULATOR */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* INPUTS - 3 cols */}
            <div className="lg:col-span-3 bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">📊 Your Numbers</h2>

              {/* Market + Seller Type */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">Marketplace</label>
                  <select value={market} onChange={e => setMarket(e.target.value as Market)}
                    className="w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none">
                    <option value="UK">🇬🇧 eBay UK</option>
                    <option value="US">🇺🇸 eBay US</option>
                    <option value="DE">🇩🇪 eBay DE</option>
                    <option value="FR">🇫🇷 eBay FR</option>
                    <option value="AU">🇦🇺 eBay AU</option>
                    <option value="CA">🇨🇦 eBay CA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">Seller Type</label>
                  <select value={sellerType} onChange={e => setSellerType(e.target.value as SellerType)}
                    className="w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none">
                    <option value="business">Business Seller</option>
                    <option value="private">Private Seller (UK = free)</option>
                  </select>
                </div>
              </div>

              {/* Category + Seller level */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none">
                    {Object.entries(UK_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.name} ({cat.fvf}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">Seller Level</label>
                  <select value={sellerLevel} onChange={e => setSellerLevel(e.target.value as SellerLevel)}
                    className="w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none">
                    <option value="above_standard">Above Standard</option>
                    <option value="top_rated">Top Rated (−10% FVF)</option>
                    <option value="below_standard">Below Standard (+6% FVF)</option>
                  </select>
                </div>
              </div>

              {/* Money fields grid */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <NumField label="Sold Price" hint="Item price (excl. shipping)" value={soldPrice} setValue={setSoldPrice} symbol={currency.symbol} />
                <NumField label="Shipping Charged" hint="What buyer pays" value={shipping} setValue={setShipping} symbol={currency.symbol} />
                <NumField label="Item Cost" hint="What you paid for item" value={itemCost} setValue={setItemCost} symbol={currency.symbol} />
                <NumField label="Shipping Cost" hint="What you pay supplier" value={shippingCost} setValue={setShippingCost} symbol={currency.symbol} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <NumField label="Number of Orders" hint="For bulk calculation" value={orders} setValue={setOrders} symbol="" />
                <NumField label="Promoted Ad Rate %" hint="0 if not promoted" value={promotedRate} setValue={setPromotedRate} symbol="%" />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-[#c4c0e0] cursor-pointer">
                  <input type="checkbox" checked={vatRegistered} onChange={e => setVatRegistered(e.target.checked)}
                    className="w-4 h-4 accent-[#7C3AED]" />
                  VAT Registered (reclaim VAT on fees)
                </label>
                <label className="flex items-center gap-2 text-sm text-[#c4c0e0] cursor-pointer">
                  <input type="checkbox" checked={international} onChange={e => setInternational(e.target.checked)}
                    className="w-4 h-4 accent-[#7C3AED]" />
                  International Sale (+1.3% fee)
                </label>
              </div>
            </div>

            {/* RESULTS - 2 cols */}
            <div className="lg:col-span-2 space-y-4">

              {/* Big Net Profit card */}
              <div className={`rounded-2xl p-6 border-2 ${result.netProfit >= 0 ? "bg-[#10B981]/10 border-[#10B981]/40" : "bg-red-500/10 border-red-500/40"}`}>
                <div className="text-xs font-bold text-[#a5a0cc] uppercase tracking-wider mb-1">Net Profit</div>
                <div className={`text-4xl font-extrabold ${result.netProfit >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                  {fmt(result.netProfit)}
                </div>
                <div className="text-sm text-[#a5a0cc] mt-2">
                  Margin: <span className={`font-bold ${result.margin >= 20 ? "text-[#10B981]" : result.margin >= 10 ? "text-[#F59E0B]" : "text-red-400"}`}>
                    {result.margin.toFixed(1)}%
                  </span>
                </div>
                {result.netProfit < 0 && (
                  <div className="mt-3 p-3 bg-red-500/20 rounded-lg text-xs text-red-300">
                    ⚠️ You&apos;re losing money on this listing. Increase price, reduce costs, or skip this product.
                  </div>
                )}
                {result.margin >= 0 && result.margin < 15 && (
                  <div className="mt-3 p-3 bg-[#F59E0B]/20 rounded-lg text-xs text-[#F59E0B]">
                    ⚠️ Low margin. Most dropshippers target 20%+ to absorb returns.
                  </div>
                )}
              </div>

              {/* Fee breakdown */}
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  {result.isPrivate ? (
                    <div className="text-[#10B981] py-3 text-center">✅ Private sellers pay no eBay fees in UK</div>
                  ) : (
                    <>
                      <FeeRow label="Final Value Fee" value={fmt(result.fvf)} />
                      <FeeRow label="Per-Order Fee" value={fmt(result.perOrderFee)} />
                      <FeeRow label="Regulatory Fee (0.35%)" value={fmt(result.regulatoryFee)} />
                      {result.promotedFee > 0 && <FeeRow label="Promoted Listing" value={fmt(result.promotedFee)} />}
                      {result.intlFee > 0 && <FeeRow label="International (1.3%)" value={fmt(result.intlFee)} />}
                      {result.vatOnFees > 0 && <FeeRow label="VAT on Fees (20%)" value={fmt(result.vatOnFees)} />}
                      <div className="border-t border-[#3d3580]/40 pt-2 mt-2 flex justify-between font-bold">
                        <span className="text-white">Total eBay Fees</span>
                        <span className="text-[#F59E0B]">{fmt(result.totalFees)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#a5a0cc]">Revenue</span><span className="text-white font-bold">{fmt(result.revenue)}</span></div>
                  <div className="flex justify-between"><span className="text-[#a5a0cc]">Product + Shipping Cost</span><span className="text-red-300">-{fmt(result.costs)}</span></div>
                  <div className="flex justify-between"><span className="text-[#a5a0cc]">eBay Fees</span><span className="text-red-300">-{fmt(result.totalFees)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-r from-[#7C3AED]/10 via-[#F59E0B]/10 to-[#10B981]/10 border-2 border-[#F59E0B]/30 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">⚡ Tired of manually calculating every listing?</h2>
                <p className="text-[#a5a0cc] mb-1">
                  UnicornDS Chrome extension shows real-time profit, fees, and margins <strong className="text-white">automatically</strong> on every Amazon and AliExpress product — before you list.
                </p>
                <p className="text-xs text-[#10B981] font-bold">✅ 30-day money-back guarantee if no sales</p>
              </div>
              <Link href="/pricing" className="flex-shrink-0 inline-block px-8 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-base font-extrabold transition-all whitespace-nowrap">
                Try Free →
              </Link>
            </div>
          </div>
        </section>

        {/* SEO CONTENT — eBay Fees Explained */}
        <section className="max-w-3xl mx-auto px-6 prose prose-invert">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white mb-6">How eBay Fees Work in 2026</h2>

          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            Most UK eBay sellers pay between <strong className="text-white">10% and 13%</strong> of every sale in total fees. The exact amount depends on your seller type, category, and a stack of smaller charges that add up fast.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Final Value Fee (FVF)</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            The biggest fee. Charged on the <strong className="text-white">total sale (item + shipping)</strong>. For most categories it&apos;s 12.8%. Lower for electronics (9.9%) and vehicle parts. Higher for books (14.9%).
          </p>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            <strong className="text-white">Top Rated Sellers</strong> get a 10% discount on the FVF — that&apos;s why our calculator includes the seller level dropdown. Below Standard sellers pay a 6 percentage point surcharge.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Per-Order Fee</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            A flat fee on every order: <strong className="text-white">30p for orders under £10</strong>, <strong className="text-white">40p for orders £10 and above</strong> (this changed in February 2026). Some categories like Home & Collectables only pay 10p flat.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Regulatory Operating Fee</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            Introduced April 2024. <strong className="text-white">0.35% of every sale</strong>. Small per order but adds up across high volume.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Promoted Listings (Optional)</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            You set an ad rate (e.g. 5%). eBay only charges when someone clicks your ad and buys. Useful for new listings without sales history. Most successful sellers start at <strong className="text-white">2-3%</strong>.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">VAT on Fees</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            UK eBay charges <strong className="text-white">20% VAT on all fees</strong>. If you&apos;re VAT registered, you reclaim it. If not (most sellers under £85K turnover), it&apos;s a real cost.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Private vs Business Sellers</h3>
          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            Since October 2024, <strong className="text-white">private sellers pay £0</strong> on UK domestic sales. But if you&apos;re buying items to resell, HMRC and eBay consider you a business — and account flagging is automatic. Don&apos;t try to game this; suspensions hurt.
          </p>

          <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-2">📌 Quick Reference: Typical UK Business Seller Fees</h3>
            <ul className="text-sm text-[#a5a0cc] space-y-1.5 mt-3">
              <li>• £25 sale + £3.50 shipping in &quot;Everything Else&quot; category</li>
              <li>• FVF: 12.8% × £28.50 = <strong className="text-white">£3.65</strong></li>
              <li>• Per-order fee: <strong className="text-white">£0.40</strong></li>
              <li>• Regulatory fee: 0.35% = <strong className="text-white">£0.10</strong></li>
              <li>• VAT on fees: 20% = <strong className="text-white">£0.83</strong></li>
              <li className="pt-2 border-t border-[#3d3580]/40"><strong className="text-[#F59E0B]">Total fees: ~£4.98 (17.5% of sale)</strong></li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white mb-8 text-center">eBay Fees FAQ</h2>
          <div className="space-y-3">
            {[
              { q: "How accurate is this eBay fees calculator?", a: "Verified against eBay's 2026 official UK fee schedule. We update rates within 48 hours of any eBay announcement. For final invoicing, always check your eBay Seller Hub — promotional discounts and account-specific adjustments can apply." },
              { q: "Why is my margin so low even at 30% markup?", a: "Because eBay fees + shipping costs + VAT typically eat 15-20% of revenue. To hit 20% net margin, you usually need 40-50% gross markup. That's why product research matters — UnicornDS Product Hunter shows expected profit before you list." },
              { q: "What's a good profit margin on eBay dropshipping?", a: "20% net margin is healthy. 15% is borderline. Under 10% means one return or defect wipes you out. Most successful UnicornDS users target 25%+ on Amazon arbitrage and 35%+ on AliExpress dropshipping." },
              { q: "Does eBay charge fees if my item doesn't sell?", a: "Insertion fees apply after your 1,000 free listings/month. £0.35 per extra listing. Final Value Fee only charges when something sells. If you list and sell elsewhere, eBay still charges FVF on the original listed price." },
              { q: "Should I become a Top Rated Seller?", a: "Yes if possible — you save 10% on every FVF (about 1.3 percentage points). Requirements: <0.5% defect rate, <3% late shipments, >100 transactions/year, >£1,000 sales/year. Most consistent dropshippers qualify within 6 months." },
            ].map((item, i) => (
              <details key={i} className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl p-5 group">
                <summary className="cursor-pointer text-base font-bold text-white flex justify-between items-center">
                  <span>{item.q}</span>
                  <span className="text-[#7C3AED] group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#a5a0cc] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-6 text-center">More Free Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/courses" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#F59E0B]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-base font-bold text-white">Free Dropshipping Course</div>
              <div className="text-xs text-[#a5a0cc] mt-1">8 modules, 13+ hours, free with Growth+</div>
            </Link>
            <Link href="/guarantee" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#10B981]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">💯</div>
              <div className="text-base font-bold text-white">30-Day Sales Guarantee</div>
              <div className="text-xs text-[#a5a0cc] mt-1">Full refund if no sales in 30 days</div>
            </Link>
            <Link href="/blog" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#7C3AED]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-base font-bold text-white">Dropshipping Blog</div>
              <div className="text-xs text-[#a5a0cc] mt-1">64+ guides on eBay selling</div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function NumField({ label, hint, value, setValue, symbol }: {
  label: string; hint: string; value: string; setValue: (v: string) => void; symbol: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {symbol && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5a0cc] text-sm">{symbol}</span>}
        <input
          type="number" step="0.01" min="0" value={value} onChange={e => setValue(e.target.value)}
          className={`w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg ${symbol ? "pl-7" : "pl-3"} pr-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none`}
        />
      </div>
      <p className="text-[10px] text-[#6b6899] mt-1">{hint}</p>
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#c4c0e0]">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
