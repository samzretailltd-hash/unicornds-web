import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "30-Day Sales Guarantee — Zero Risk",
  description: "100% money-back guarantee if you don't make a sale in 30 days using UnicornDS. No questions, no fine print, no hoops. Try risk-free.",
  alternates: { canonical: "https://www.unicornds.io/guarantee" },
};

export default function GuaranteePage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-6">
      {/* HERO */}
      <div className="text-center mb-12">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-sm text-[#10B981] font-extrabold mb-6">
          ✅ ZERO-RISK PROMISE
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
          No Sales in 30 Days?<br />
          <span className="text-[#10B981]">We Refund 100%.</span>
        </h1>
        <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">
          We're so confident UnicornDS works, we'll give you every penny back if you don't make a single sale in your first month.
        </p>
      </div>

      {/* THE BIG BADGE */}
      <div className="bg-gradient-to-r from-[#10B981]/10 via-[#F59E0B]/5 to-[#7C3AED]/10 border-2 border-[#10B981]/30 rounded-3xl p-10 mb-12 text-center">
        <div className="text-7xl mb-4">💯</div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-white mb-3">
          100% Money-Back · 30-Day Sales Guarantee
        </h2>
        <p className="text-[#a5a0cc] max-w-xl mx-auto">
          The strongest guarantee in the eBay dropshipping industry. No fine print.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { num: "1", title: "Subscribe Today", desc: "Pick any plan — Starter, Growth, Empire, or Mastery. Pay your first month." },
          { num: "2", title: "List 10+ Products", desc: "Use UnicornDS to list at least 10 products in the next 30 days. We'll help if you need it." },
          { num: "3", title: "No Sale? Get Refund.", desc: "If zero of those products sell, email us. Full refund in 5 business days. No questions asked." },
        ].map(step => (
          <div key={step.num} className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#10B981] flex items-center justify-center text-2xl font-extrabold text-white">
              {step.num}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-[#a5a0cc]">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* WHY WE OFFER */}
      <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-8 mb-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-4">Why We Can Offer This</h2>
        <p className="text-[#a5a0cc] leading-relaxed mb-4">
          Most eBay dropshipping tools won't guarantee sales because they can't. Their tools are generic — same templates, same titles, same suppliers as everyone else. So products don't stand out.
        </p>
        <p className="text-[#a5a0cc] leading-relaxed mb-4">
          UnicornDS is different. Our AI writes Cassini-optimized titles that <strong className="text-white">actually rank on eBay search</strong>. Our descriptions follow mobile-first SEO rules. Our VERO checker blocks 3,629 restricted brands before you waste time listing them. Our extension supports both Amazon AND AliExpress — twice the product pool.
        </p>
        <p className="text-[#a5a0cc] leading-relaxed">
          We know our system works. 87% of sellers using UnicornDS make their first sale within 14 days. So if you follow the process and don't sell, something is wrong on our end — and we'll happily refund you.
        </p>
      </div>

      {/* THE FINE PRINT - HONEST */}
      <div className="bg-[#0f0e1a] border border-[#3d3580]/40 rounded-2xl p-8 mb-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-4">The Honest Fine Print</h2>
        <ul className="space-y-3 text-[#a5a0cc]">
          <li className="flex gap-3">
            <span className="text-[#10B981] font-bold flex-shrink-0">✓</span>
            <span>Must list at least 10 products using UnicornDS in 30 days. We'll prove you didn't through extension logs.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#10B981] font-bold flex-shrink-0">✓</span>
            <span>Refund covers your first month's subscription only. We don't refund eBay fees or supplier costs (those go to eBay and your supplier, not us).</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#10B981] font-bold flex-shrink-0">✓</span>
            <span>Email <a href="mailto:support@unicornds.io" className="text-[#F59E0B] underline">support@unicornds.io</a> within 35 days of subscribing. We process refunds within 5 business days.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#10B981] font-bold flex-shrink-0">✓</span>
            <span>Account must not be suspended by eBay during the 30 days. (We can't guarantee sales on a suspended account.)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#10B981] font-bold flex-shrink-0">✓</span>
            <span>One refund per customer. Sign up again later if you change your mind — full price applies.</span>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/pricing"
          className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
        >
          🚀 Start Risk-Free Today
        </Link>
        <p className="mt-4 text-sm text-[#6b6899]">Cancel anytime · Stripe secure · UK-based support</p>
      </div>
    </div>
  );
}
