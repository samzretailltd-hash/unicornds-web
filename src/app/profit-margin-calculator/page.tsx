"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Scenario {
  name: string;
  emoji: string;
  itemCost: number;
  sellPrice: number;
  shippingCharged: number;
  shippingCost: number;
}

const PRESETS: Scenario[] = [
  { name: "Amazon Arbitrage", emoji: "📦", itemCost: 12, sellPrice: 24.99, shippingCharged: 3.50, shippingCost: 0 },
  { name: "AliExpress Dropshipping", emoji: "🚀", itemCost: 4.50, sellPrice: 19.99, shippingCharged: 2.99, shippingCost: 1.20 },
  { name: "Wholesale Bulk", emoji: "📊", itemCost: 6, sellPrice: 22.99, shippingCharged: 0, shippingCost: 2.50 },
  { name: "Used / Refurb Resell", emoji: "♻️", itemCost: 8, sellPrice: 39.99, shippingCharged: 0, shippingCost: 3 },
];

export default function ProfitMarginCalculatorPage() {
  const [itemCost, setItemCost] = useState("12");
  const [sellPrice, setSellPrice] = useState("24.99");
  const [shippingCharged, setShippingCharged] = useState("3.50");
  const [shippingCost, setShippingCost] = useState("0");
  const [paymentFeePercent, setPaymentFeePercent] = useState("2.9");
  const [platformFeePercent, setPlatformFeePercent] = useState("12.8");
  const [otherCosts, setOtherCosts] = useState("0");
  const [orders, setOrders] = useState("1");

  const result = useMemo(() => {
    const ic = parseFloat(itemCost) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const shc = parseFloat(shippingCharged) || 0;
    const sco = parseFloat(shippingCost) || 0;
    const pf = parseFloat(paymentFeePercent) || 0;
    const plf = parseFloat(platformFeePercent) || 0;
    const oc = parseFloat(otherCosts) || 0;
    const o = parseInt(orders) || 1;

    const revenue = sp + shc;
    const totalCosts = ic + sco + oc;
    const platformFee = revenue * (plf / 100);
    const paymentFee = revenue * (pf / 100);
    const totalFees = platformFee + paymentFee;
    const netProfit = revenue - totalCosts - totalFees;
    const grossMargin = revenue > 0 ? ((revenue - totalCosts) / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markup = totalCosts > 0 ? ((sp - ic) / ic) * 100 : 0;
    const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
    const breakEven = totalCosts + totalFees;

    return {
      revenue: revenue * o,
      totalCosts: totalCosts * o,
      platformFee: platformFee * o,
      paymentFee: paymentFee * o,
      netProfit: netProfit * o,
      perOrderProfit: netProfit,
      grossMargin,
      netMargin,
      markup,
      roi,
      breakEven,
    };
  }, [itemCost, sellPrice, shippingCharged, shippingCost, paymentFeePercent, platformFeePercent, otherCosts, orders]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

  const applyPreset = (preset: Scenario) => {
    setItemCost(preset.itemCost.toString());
    setSellPrice(preset.sellPrice.toString());
    setShippingCharged(preset.shippingCharged.toString());
    setShippingCost(preset.shippingCost.toString());
  };

  const marginColor = result.netMargin >= 20 ? "text-[#10B981]" :
                      result.netMargin >= 10 ? "text-[#F59E0B]" : "text-red-400";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Profit Margin Calculator for eBay Dropshipping",
          description: "Free profit margin calculator for eBay sellers, Amazon arbitrage and AliExpress dropshipping",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
        }),
      }} />

      <div className="pt-24 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-12">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-sm text-[#F59E0B] font-bold mb-6">
            🎁 100% Free — No Signup
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-5 leading-tight">
            Profit Margin <span className="text-[#10B981]">Calculator</span>
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">
            Know your real margin before you list. Built for eBay dropshippers using Amazon, AliExpress, and wholesale suppliers.
          </p>
        </section>

        {/* PRESETS */}
        <section className="max-w-5xl mx-auto px-6 mb-6">
          <p className="text-xs text-[#a5a0cc] mb-3 font-bold uppercase tracking-wider">Quick Start — Try a scenario:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => applyPreset(p)}
                className="bg-[#1E1B4B]/50 hover:bg-[#1E1B4B] border border-[#3d3580]/40 hover:border-[#7C3AED]/60 rounded-xl p-3 text-left transition-all">
                <div className="text-2xl mb-1">{p.emoji}</div>
                <div className="text-sm font-bold text-white">{p.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* INPUTS */}
            <div className="lg:col-span-3 bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">📊 Your Numbers</h2>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <NumField label="Item Cost" hint="What you pay supplier" value={itemCost} setValue={setItemCost} symbol="£" />
                <NumField label="Sell Price" hint="Listed on eBay" value={sellPrice} setValue={setSellPrice} symbol="£" />
                <NumField label="Shipping Charged" hint="To buyer" value={shippingCharged} setValue={setShippingCharged} symbol="£" />
                <NumField label="Shipping Cost" hint="You pay supplier (0 if Prime)" value={shippingCost} setValue={setShippingCost} symbol="£" />
              </div>

              <div className="border-t border-[#3d3580]/30 my-5 pt-5">
                <p className="text-xs text-[#a5a0cc] mb-4 font-bold uppercase tracking-wider">Fees & Other Costs</p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <NumField label="Platform Fee %" hint="eBay default: 12.8%" value={platformFeePercent} setValue={setPlatformFeePercent} symbol="%" />
                  <NumField label="Payment Fee %" hint="PayPal/Card: ~2.9%" value={paymentFeePercent} setValue={setPaymentFeePercent} symbol="%" />
                  <NumField label="Other Costs" hint="Packaging, labels, etc" value={otherCosts} setValue={setOtherCosts} symbol="£" />
                  <NumField label="Orders" hint="For bulk calculation" value={orders} setValue={setOrders} symbol="" />
                </div>
              </div>

              <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg p-4 mt-4">
                <p className="text-xs text-[#a5a0cc]">
                  💡 <strong className="text-white">Pro tip:</strong> For accurate eBay fees with VAT, regulatory fee, and seller level, use our{" "}
                  <Link href="/ebay-fees-calculator" className="text-[#10B981] hover:underline font-bold">eBay Fees Calculator</Link>.
                  This calculator is simpler and works for any marketplace.
                </p>
              </div>
            </div>

            {/* RESULTS */}
            <div className="lg:col-span-2 space-y-4">
              {/* Big Net Profit */}
              <div className={`rounded-2xl p-6 border-2 ${result.netProfit >= 0 ? "bg-[#10B981]/10 border-[#10B981]/40" : "bg-red-500/10 border-red-500/40"}`}>
                <div className="text-xs font-bold text-[#a5a0cc] uppercase tracking-wider mb-1">Net Profit (Total)</div>
                <div className={`text-4xl font-extrabold ${result.netProfit >= 0 ? "text-[#10B981]" : "text-red-400"}`}>
                  {fmt(result.netProfit)}
                </div>
                {parseInt(orders) > 1 && (
                  <div className="text-sm text-[#a5a0cc] mt-1">
                    {fmt(result.perOrderProfit)} per order × {orders}
                  </div>
                )}
              </div>

              {/* Margin breakdown */}
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Margin Analysis</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Net Margin" value={`${result.netMargin.toFixed(1)}%`} color={marginColor} />
                  <Metric label="Gross Margin" value={`${result.grossMargin.toFixed(1)}%`} color="text-white" />
                  <Metric label="Markup" value={`${result.markup.toFixed(0)}%`} color="text-[#A78BFA]" />
                  <Metric label="ROI" value={`${result.roi.toFixed(0)}%`} color={result.roi >= 50 ? "text-[#10B981]" : "text-[#F59E0B]"} />
                </div>

                {result.netMargin < 0 && (
                  <div className="mt-4 p-3 bg-red-500/20 rounded-lg text-xs text-red-300">
                    ⚠️ Negative margin — you&apos;re losing money. Either increase price, find cheaper supplier, or skip this product.
                  </div>
                )}
                {result.netMargin >= 0 && result.netMargin < 15 && (
                  <div className="mt-4 p-3 bg-[#F59E0B]/20 rounded-lg text-xs text-[#F59E0B]">
                    ⚠️ Low margin. One return wipes you out. Target 20%+.
                  </div>
                )}
                {result.netMargin >= 20 && (
                  <div className="mt-4 p-3 bg-[#10B981]/20 rounded-lg text-xs text-[#10B981]">
                    ✅ Healthy margin. Safe to list and scale.
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Revenue" value={fmt(result.revenue)} color="text-white" bold />
                  <Row label="Product + Shipping Cost" value={`-${fmt(result.totalCosts)}`} color="text-red-300" />
                  <Row label="Platform Fee" value={`-${fmt(result.platformFee)}`} color="text-red-300" />
                  <Row label="Payment Fee" value={`-${fmt(result.paymentFee)}`} color="text-red-300" />
                  <div className="border-t border-[#3d3580]/40 pt-2 mt-2">
                    <Row label="Break-even price" value={fmt(result.breakEven)} color="text-[#F59E0B]" bold />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-r from-[#7C3AED]/10 via-[#10B981]/10 to-[#F59E0B]/10 border-2 border-[#10B981]/30 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">⚡ Stop calculating one product at a time</h2>
                <p className="text-[#a5a0cc] mb-1">
                  UnicornDS Chrome extension shows live margin on <strong className="text-white">every Amazon and AliExpress product</strong> you browse. Find winners in seconds, not hours.
                </p>
                <p className="text-xs text-[#10B981] font-bold">✅ 30-day money-back guarantee</p>
              </div>
              <Link href="/pricing" className="flex-shrink-0 inline-block px-8 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-base font-extrabold transition-all whitespace-nowrap">
                Try Free →
              </Link>
            </div>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="max-w-3xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white mb-6">How to Calculate Profit Margin for Dropshipping</h2>

          <p className="text-[#a5a0cc] leading-relaxed mb-4">
            Most failing eBay dropshippers don&apos;t calculate margin properly. They look at &ldquo;sell price minus item cost&rdquo; and think they&apos;re profitable. They&apos;re not.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">The 4 Margins You Must Know</h3>
          <ul className="text-[#a5a0cc] space-y-3 mb-6">
            <li><strong className="text-white">Markup:</strong> (Sell Price − Cost) ÷ Cost. Tells you how many times you marked it up. 100% markup = doubled the price.</li>
            <li><strong className="text-white">Gross Margin:</strong> (Revenue − Costs) ÷ Revenue. Excludes fees. Useful for comparing products.</li>
            <li><strong className="text-white">Net Margin:</strong> (Profit after ALL fees) ÷ Revenue. This is the only number that matters for your bank account.</li>
            <li><strong className="text-white">ROI:</strong> Profit ÷ Total Costs. How efficient is your capital? Above 100% means you doubled your money.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">What&apos;s a Good Net Margin?</h3>
          <ul className="text-[#a5a0cc] space-y-2 mb-6">
            <li>• <strong className="text-red-400">Below 10%:</strong> Dangerous. Returns or defects wipe you out.</li>
            <li>• <strong className="text-[#F59E0B]">10-15%:</strong> Acceptable for very high volume only.</li>
            <li>• <strong className="text-[#10B981]">20-30%:</strong> Healthy. Most successful dropshippers target this.</li>
            <li>• <strong className="text-[#10B981]">30%+:</strong> Excellent. Usually AliExpress or wholesale arbitrage.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Hidden Costs Most Sellers Forget</h3>
          <ul className="text-[#a5a0cc] space-y-2 mb-6">
            <li>• <strong className="text-white">Returns:</strong> Average 3-5% of orders. Eats 15-30% of profit on a 20% margin.</li>
            <li>• <strong className="text-white">Defects:</strong> Stock-outs, late shipments. Damage your eBay metrics.</li>
            <li>• <strong className="text-white">VAT:</strong> If you cross £85K turnover/year, +20% on everything.</li>
            <li>• <strong className="text-white">Refunds:</strong> Some platforms keep their fee even on refunded orders.</li>
            <li>• <strong className="text-white">Promoted listings:</strong> 2-5% extra to get visibility.</li>
          </ul>

          <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/40 rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-3">📌 Real Example — Amazon Arbitrage Done Right</h3>
            <ul className="text-sm text-[#a5a0cc] space-y-1.5">
              <li>• Find product on Amazon: £12 with Prime shipping</li>
              <li>• List on eBay: £24.99 + £3.50 shipping</li>
              <li>• Revenue: £28.49</li>
              <li>• Costs: £12.00 (Amazon Prime ships free to buyer)</li>
              <li>• Fees: 12.8% × £28.49 = £3.65 + £0.40 per-order fee</li>
              <li>• Payment: 2.9% × £28.49 = £0.83</li>
              <li className="pt-2 border-t border-[#3d3580]/40"><strong className="text-[#10B981]">Net profit: £11.61 (40.8% margin) ✅</strong></li>
            </ul>
          </div>
        </section>

        {/* Related */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-6 text-center">More Free Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ebay-fees-calculator" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#10B981]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">🧮</div>
              <div className="text-base font-bold text-white">eBay Fees Calculator</div>
              <div className="text-xs text-[#a5a0cc] mt-1">Full UK 2026 rates with VAT</div>
            </Link>
            <Link href="/glossary" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#7C3AED]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-base font-bold text-white">Dropshipping Glossary</div>
              <div className="text-xs text-[#a5a0cc] mt-1">50+ eBay terms explained</div>
            </Link>
            <Link href="/courses" className="bg-[#1E1B4B]/40 hover:bg-[#1E1B4B]/70 border border-[#3d3580]/40 hover:border-[#F59E0B]/60 rounded-xl p-5 transition-all">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-base font-bold text-white">Free Mastery Course</div>
              <div className="text-xs text-[#a5a0cc] mt-1">8 modules with Growth+</div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function NumField({ label, hint, value, setValue, symbol }: { label: string; hint: string; value: string; setValue: (v: string) => void; symbol: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#a5a0cc] mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {symbol && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5a0cc] text-sm">{symbol}</span>}
        <input type="number" step="0.01" min="0" value={value} onChange={e => setValue(e.target.value)}
          className={`w-full bg-[#0f0e1a] border border-[#3d3580] text-white rounded-lg ${symbol ? "pl-7" : "pl-3"} pr-3 py-2.5 text-sm focus:border-[#7C3AED] focus:outline-none`} />
      </div>
      <p className="text-[10px] text-[#6b6899] mt-1">{hint}</p>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0f0e1a]/50 rounded-lg p-3">
      <div className="text-[10px] text-[#a5a0cc] uppercase tracking-wider font-bold mb-1">{label}</div>
      <div className={`text-xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#a5a0cc]">{label}</span>
      <span className={`${color} ${bold ? "font-bold" : "font-medium"}`}>{value}</span>
    </div>
  );
}
