import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UnicornDS vs EcomSniper — Which eBay Dropshipping Tool Wins in 2026?",
  description: "Honest comparison of UnicornDS vs EcomSniper. Pricing, features, AliExpress support, course, guarantee. £59.99 vs $199 — see what you actually get.",
  keywords: ["unicornds vs ecomsniper", "ecomsniper alternative", "ecomsniper review", "ebay dropshipping tool comparison"],
  alternates: { canonical: "https://www.unicornds.io/vs/ecomsniper" },
};

const COMPARISON = [
  { feature: "Starting price (after trial)", uds: "£29.99/mo", ecom: "$97 (~£77) first month, $199/mo after", winner: "uds" },
  { feature: "First-month price", uds: "£29.99 (or £1 trial)", ecom: "$97 (~£77)", winner: "uds" },
  { feature: "Listings included", uds: "500–3,000/mo by tier", ecom: "3,000 (Empire bundle)", winner: "tie" },
  { feature: "Chrome extension", uds: "✅ Manifest V3 latest", ecom: "✅", winner: "tie" },
  { feature: "Amazon arbitrage", uds: "✅ All Amazon marketplaces", ecom: "✅", winner: "tie" },
  { feature: "AliExpress dropshipping", uds: "✅ Variations + skuId capture", ecom: "❌ Amazon only", winner: "uds" },
  { feature: "AI Cassini titles", uds: "✅ GPT-4o, 80-char optimised", ecom: "✅ Generic template", winner: "uds" },
  { feature: "VERO protection", uds: "✅ 3,629 brands auto-blocked", ecom: "✅", winner: "tie" },
  { feature: "Bulk Lister", uds: "✅ Up to 10 concurrent tabs", ecom: "✅ One-click bulk", winner: "tie" },
  { feature: "MSKU / Variations builder", uds: "✅ Empire tier", ecom: "✅", winner: "tie" },
  { feature: "Order Manager", uds: "✅ Full dashboard with margins", ecom: "❌ Limited", winner: "uds" },
  { feature: "Address auto-capture", uds: "✅ During order sync", ecom: "❌ Manual", winner: "uds" },
  { feature: "Tracking + Supplier ID storage", uds: "✅ Combined modal", ecom: "❌", winner: "uds" },
  { feature: "Buyer messaging templates", uds: "✅ 12 templates + 8 smart vars", ecom: "✅ Basic templates", winner: "uds" },
  { feature: "Stock Checker", uds: "✅ Unlimited on Growth+", ecom: "✅", winner: "tie" },
  { feature: "Repricer", uds: "🟡 Coming soon", ecom: "✅", winner: "ecom" },
  { feature: "Mastery course included", uds: "✅ FREE with Growth/Empire", ecom: "❌ Course = separate bundle", winner: "uds" },
  { feature: "Private Telegram community", uds: "✅ Growth+", ecom: "✅ VIP only", winner: "uds" },
  { feature: "1-on-1 onboarding call", uds: "✅ Empire", ecom: "❌ Coaching = VIP upgrade", winner: "uds" },
  { feature: "30-day SALES guarantee", uds: "✅ Refund if no sales", ecom: "❌ 30-day time-based refund only", winner: "uds" },
  { feature: "UK tax & HMRC module", uds: "✅ Full module", ecom: "❌ US-focused", winner: "uds" },
  { feature: "Multi-marketplace (UK/US/DE/FR/AU/CA)", uds: "✅ All 6", ecom: "❌ Primarily US", winner: "uds" },
  { feature: "Free eBay fees calculator", uds: "✅ /ebay-fees-calculator", ecom: "❌", winner: "uds" },
  { feature: "Profit margin calculator", uds: "✅ /profit-margin-calculator", ecom: "❌", winner: "uds" },
  { feature: "Glossary of terms", uds: "✅ 60+ terms", ecom: "❌", winner: "uds" },
  { feature: "Dropshipping blog", uds: "✅ 64+ guides", ecom: "✅ Some content", winner: "uds" },
  { feature: "Affiliate program", uds: "✅ 30% commission", ecom: "✅", winner: "tie" },
  { feature: "Customer support", uds: "✅ Email + Telegram + AI chat (Uni)", ecom: "✅ Live chat", winner: "tie" },
];

const FAQ = [
  { q: "Why is UnicornDS so much cheaper than EcomSniper?", a: "We're based in the UK with lower costs and we believe in volume over margins. We'd rather have 1,000 paying users at £59.99 than 200 at $199. Same software, less marketing fluff." },
  { q: "Does UnicornDS work in the US like EcomSniper?", a: "Yes. UnicornDS supports eBay US, UK, DE, FR, AU, and CA. EcomSniper is primarily US-focused, which is why their tax/legal training doesn't apply to UK sellers." },
  { q: "If I'm already on EcomSniper, can I switch easily?", a: "Yes. Cancel EcomSniper, install UnicornDS from the Chrome Web Store, sign up for the £1 7-day trial. Your existing eBay account works immediately. Most switches take less than 15 minutes." },
  { q: "What does UnicornDS NOT have that EcomSniper has?", a: "Honest answer: their repricer is more mature than ours (we're shipping ours soon). Their course library is bigger (more videos, though arguably padded). Their brand recognition in the US is stronger. That's about it." },
  { q: "Will my eBay account get banned faster with UnicornDS?", a: "No. Both tools use the same eBay APIs and follow eBay's automation rules. Account safety is about VERO compliance, late shipments, and defect rate — not which tool you use. UnicornDS VERO checker is the most comprehensive in the industry (3,629 brands)." },
  { q: "Why should I trust a 30-day SALES guarantee?", a: "Because we know our system works and we'd rather refund the 5% who fail than overcharge the 95% who succeed. Email support@unicornds.io within 35 days of subscribing if you listed 10+ products and made zero sales. Full refund, no hoops." },
];

export default function VsEcomSniperPage() {
  return (
    <div className="pt-24 pb-20">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-16">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-sm text-[#F59E0B] font-bold mb-6">
          📊 Honest 2026 Comparison
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
          UnicornDS <span className="text-[#F59E0B]">vs</span> EcomSniper
        </h1>
        <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed mb-8">
          Same job. Half the price. Better guarantee. Here&apos;s the honest side-by-side.
        </p>

        {/* Top-line price comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2d2875] border-2 border-[#F59E0B] rounded-2xl p-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#1E1B4B] text-[10px] font-extrabold px-4 py-1 rounded-full tracking-wider">RECOMMENDED</span>
            <div className="text-3xl mb-2">🦄</div>
            <div className="text-xl font-bold text-white mb-1">UnicornDS Growth</div>
            <div className="text-4xl font-extrabold text-[#F59E0B] mt-3">£59.99<span className="text-base font-normal text-[#a5a0cc]">/mo</span></div>
            <div className="text-xs text-[#10B981] font-bold mt-2">+ Free Mastery Course + Telegram</div>
            <div className="text-xs text-[#10B981] font-bold mt-1">30-day SALES guarantee</div>
          </div>
          <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-xl font-bold text-white mb-1">EcomSniper</div>
            <div className="text-4xl font-extrabold text-[#6b6899] mt-3">$199<span className="text-base font-normal text-[#a5a0cc]">/mo</span></div>
            <div className="text-xs text-[#a5a0cc] mt-2">~£158/mo (after $97 first month)</div>
            <div className="text-xs text-[#6b6899] mt-1">30-day refund (time-based)</div>
          </div>
        </div>

        <div className="mt-8 inline-block px-6 py-3 bg-[#10B981]/10 border border-[#10B981]/40 rounded-full text-[#10B981] font-bold">
          💰 Save £1,176/year by switching to UnicornDS Growth
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          Feature-by-Feature Comparison
        </h2>
        <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 p-4 bg-[#0f0e1a]/60 text-xs font-bold uppercase tracking-wider text-[#a5a0cc]">
            <div>Feature</div>
            <div className="text-center text-[#F59E0B]">UnicornDS</div>
            <div className="text-center">EcomSniper</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={i} className={`grid grid-cols-[2fr_1fr_1fr] gap-4 p-4 text-sm border-t border-[#3d3580]/20 ${
              row.winner === "uds" ? "bg-[#10B981]/5" :
              row.winner === "ecom" ? "bg-red-500/5" : ""
            }`}>
              <div className="text-[#c4c0e0]">{row.feature}</div>
              <div className={`text-center ${row.winner === "uds" ? "text-[#10B981] font-bold" : "text-white"}`}>{row.uds}</div>
              <div className={`text-center ${row.winner === "ecom" ? "text-[#10B981] font-bold" : "text-[#6b6899]"}`}>{row.ecom}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-[#10B981]/10 border border-[#10B981]/40 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-[#10B981]">{COMPARISON.filter(r => r.winner === "uds").length}</div>
            <div className="text-sm text-[#a5a0cc] mt-1">UnicornDS wins</div>
          </div>
          <div className="bg-[#3d3580]/30 border border-[#3d3580] rounded-xl p-4">
            <div className="text-3xl font-extrabold text-white">{COMPARISON.filter(r => r.winner === "tie").length}</div>
            <div className="text-sm text-[#a5a0cc] mt-1">Tie</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-red-400">{COMPARISON.filter(r => r.winner === "ecom").length}</div>
            <div className="text-sm text-[#a5a0cc] mt-1">EcomSniper wins</div>
          </div>
        </div>
      </section>

      {/* WHEN TO CHOOSE WHICH */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          So Who Should Pick Which?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#10B981]/10 border-2 border-[#F59E0B]/40 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🦄 Pick UnicornDS if you...</h3>
            <ul className="space-y-2 text-sm text-[#a5a0cc]">
              <li className="flex gap-2">✅ <span>Want to keep costs under £100/month</span></li>
              <li className="flex gap-2">✅ <span>Source from both Amazon AND AliExpress</span></li>
              <li className="flex gap-2">✅ <span>Sell in UK or multi-market (EU, AU, CA)</span></li>
              <li className="flex gap-2">✅ <span>Need UK tax/VAT training</span></li>
              <li className="flex gap-2">✅ <span>Want a SALES guarantee, not just &ldquo;30-day refund&rdquo;</span></li>
              <li className="flex gap-2">✅ <span>Are starting out and want low risk</span></li>
              <li className="flex gap-2">✅ <span>Value free tools (calculator, glossary) for SEO</span></li>
            </ul>
            <Link href="/pricing" className="block mt-6 w-full py-3 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-sm font-extrabold text-center transition-all">
              Try UnicornDS — £1 trial →
            </Link>
          </div>

          <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Pick EcomSniper if you...</h3>
            <ul className="space-y-2 text-sm text-[#a5a0cc]">
              <li className="flex gap-2">⚪ <span>Don&apos;t mind paying $199/month</span></li>
              <li className="flex gap-2">⚪ <span>Only source from Amazon US (no AliExpress)</span></li>
              <li className="flex gap-2">⚪ <span>Sell exclusively in the US market</span></li>
              <li className="flex gap-2">⚪ <span>Need an established repricer NOW (we&apos;re shipping ours soon)</span></li>
              <li className="flex gap-2">⚪ <span>Trust larger US brand recognition</span></li>
            </ul>
            <p className="mt-6 text-xs text-[#6b6899] text-center italic">
              We respect EcomSniper. They built a great tool. We just think £59.99 with AliExpress + UK support is the better deal for most.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">FAQ</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
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

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#1E1B4B] to-[#2d2875] border border-[#F59E0B]/30 rounded-3xl p-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Try UnicornDS Risk-Free for <span className="text-[#F59E0B]">£1</span>
          </h2>
          <p className="text-[#a5a0cc] mb-8 max-w-xl mx-auto">
            7-day full access. List products, see if it works. Cancel anytime. If you don&apos;t make a sale in 30 days after going paid, full refund.
          </p>
          <Link href="/pricing" className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all">
            🚀 Start Trial for £1
          </Link>
          <p className="mt-4 text-xs text-[#6b6899]">Cancel anytime · Stripe secure · No long contracts</p>
        </div>
      </section>
    </div>
  );
}
