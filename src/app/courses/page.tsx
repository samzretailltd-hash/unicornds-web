import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UnicornDS Mastery — eBay Dropshipping Course + Tool Bundle | UnicornDS",
  description: "Complete eBay dropshipping course + UnicornDS Pro tool. 20% off first month. 100% money-back guarantee if no sales in 30 days. Private Telegram community + 1-on-1 coaching.",
  alternates: { canonical: "https://www.unicornds.io/courses" },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "UnicornDS Mastery — eBay Dropshipping Course",
  description: "Complete eBay dropshipping training: source from Amazon & AliExpress, list with AI, scale to £10K/month. Includes UnicornDS Pro extension + private Telegram community.",
  provider: { "@type": "Organization", name: "UnicornDS", url: "https://www.unicornds.io" },
  offers: { "@type": "Offer", price: "79.99", priceCurrency: "GBP", url: "https://www.unicornds.io/courses" },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT20H",
  },
};

const MODULES = [
  { num: "01", title: "Foundation — eBay Account Setup", lessons: 6, time: "1h 20m", desc: "Account types, selling limits, business vs personal, store subscriptions, payment setup, VERO basics." },
  { num: "02", title: "Product Research That Wins", lessons: 8, time: "2h 15m", desc: "Find proven sellers, demand scoring, Amazon arbitrage formula, AliExpress sourcing, ZIK analytics workflow, niche selection." },
  { num: "03", title: "AI-Powered Listing Mastery", lessons: 7, time: "1h 50m", desc: "Cassini SEO titles, mobile-first descriptions, item specifics for ranking, image optimization, variation listings." },
  { num: "04", title: "VERO & Account Safety", lessons: 5, time: "1h 10m", desc: "3,629 restricted brands, suspension recovery, dispute handling, MC011 fixes, multi-account strategy." },
  { num: "05", title: "Order Fulfillment & Tracking", lessons: 6, time: "1h 40m", desc: "Address auto-capture, AliExpress workflow, tracking imports, late-shipment defects, refund handling." },
  { num: "06", title: "Scaling to £10K/Month", lessons: 8, time: "2h 30m", desc: "Bulk listing systems, repricing strategies, promoted listings, store branding, international expansion (US/DE/FR/AU/CA)." },
  { num: "07", title: "Customer Service Templates", lessons: 4, time: "55m", desc: "12 message templates, smart variables, dispute resolution, feedback removal, building 100% positive feedback." },
  { num: "08", title: "Tax, Accounting & UK HMRC", lessons: 5, time: "1h 30m", desc: "VAT registration, Schedule of Goods, profit margin tracking, bookkeeping setup, tax-free thresholds." },
];

const INCLUDED = [
  { icon: "🎓", title: "Complete Video Course", desc: "8 modules, 49 lessons, 13+ hours of HD video training. Updated for 2026." },
  { icon: "🚀", title: "UnicornDS Pro Extension", desc: "Full Empire tier access — 3,000 listings/month, all features unlocked." },
  { icon: "💬", title: "Private Telegram Community", desc: "Direct access to other sellers + the team. Get answers in minutes, not days." },
  { icon: "📞", title: "1-on-1 Onboarding Call", desc: "30-minute setup call with our team. Get your first listing live the same day." },
  { icon: "📊", title: "Done-For-You Templates", desc: "Pre-built listing templates, message templates, store policies, item specifics — copy and use." },
  { icon: "🛡️", title: "VERO Brand Blacklist", desc: "Live-updated list of 3,629 restricted brands. Auto-checks every listing." },
  { icon: "🎯", title: "Winning Products List", desc: "Monthly updated list of 50+ proven products with demand scores. Stop guessing." },
  { icon: "💎", title: "Lifetime Course Updates", desc: "eBay changes constantly. Every algorithm update, we update the course. Free, forever." },
];

const FAQ = [
  { q: "What if I don't make any sales in 30 days?", a: "100% money back. No questions, no fine print. If you follow the course and don't list at least one product that sells within 30 days, email us and we refund every penny. We've never refused a refund and never will." },
  { q: "Do I need any experience?", a: "No. The course starts from zero — opening your eBay account, setting up payments, choosing your first product. By module 3 you'll list your first product. By module 6 you'll be scaling to £1K/month." },
  { q: "How is this different from EcomSniper's course?", a: "EcomSniper charges $199/mo billed monthly with a 30-day refund only. We charge £79.99 first month (£59.99 after with 20% off) AND we guarantee actual sales — not just refund availability. Plus our extension supports both Amazon AND AliExpress, theirs is Amazon-only." },
  { q: "How much can I realistically earn?", a: "Honest answer: it depends on your effort. Following the course full-time, most students hit £1,000/mo profit in month 2, £3,000-5,000/mo by month 4. Some scale to £10K+. None of this is passive — but the systems make it efficient." },
  { q: "Do I need to buy stock upfront?", a: "No. Dropshipping means you only buy from the supplier AFTER your eBay buyer pays you. Zero inventory risk. You need ~£100-200 buffer to handle the day between buyer payment and supplier shipping." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard any time. Your course access continues until the end of your billing period. No contracts, no penalties." },
  { q: "Is this UK only?", a: "No. The course covers eBay UK, US, DE, FR, AU, and CA. International sourcing from Amazon (all regions) and AliExpress. We have students selling on all 6 marketplaces." },
];

export default function CoursesPage() {
  const fullPrice = 99.99;
  const discountedFirst = 79.99;
  const monthlyAfter = 59.99;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <div className="pt-28 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-16">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-sm text-[#F59E0B] font-bold mb-6">
            🔥 NEW: 20% Off First Month + Sales Guarantee
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
            Learn eBay Dropshipping<br />
            <span className="text-[#F59E0B]">From Zero to £10K/Month</span>
          </h1>

          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto mb-8 leading-relaxed">
            8 modules · 49 lessons · 13+ hours of training · plus our entire UnicornDS Pro extension, private Telegram community, and 1-on-1 onboarding call.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-full px-5 py-2 text-[#10B981] text-sm font-bold flex items-center gap-2">
              ✅ 100% Money-Back If No Sales in 30 Days
            </div>
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-full px-5 py-2 text-[#A78BFA] text-sm font-bold">
              💬 Private Telegram Community
            </div>
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-5 py-2 text-[#F59E0B] text-sm font-bold">
              📞 1-on-1 Onboarding Call
            </div>
          </div>

          <div className="bg-[#1E1B4B] border border-[#3d3580] rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-sm text-[#a5a0cc] mb-1">First month — 20% off</div>
            <div className="flex items-baseline justify-center gap-3 mb-1">
              <span className="text-5xl font-extrabold text-[#F59E0B]">£{discountedFirst}</span>
              <span className="text-2xl line-through text-[#6b6899]">£{fullPrice}</span>
            </div>
            <div className="text-sm text-[#a5a0cc] mb-6">then £{monthlyAfter}/mo · cancel anytime</div>
            <Link
              href="/checkout?plan=mastery"
              className="block w-full py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-base font-extrabold transition-all mb-3"
            >
              🚀 Start Learning Today
            </Link>
            <div className="text-[11px] text-[#6b6899]">30-day money-back guarantee · No contracts · Stripe secure</div>
          </div>

          <p className="mt-8 text-sm text-[#6b6899]">
            ⭐⭐⭐⭐⭐ Joined by 500+ sellers · 87% report first sale within 14 days
          </p>
        </section>

        {/* COURSE CURRICULUM */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-bold uppercase tracking-wider mb-4">
              Curriculum
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-3">
              8 Modules. 49 Lessons. Everything You Need.
            </h2>
            <p className="text-[#a5a0cc]">No fluff. No 5-minute videos selling you upsells. Just the system that works.</p>
          </div>

          <div className="space-y-3">
            {MODULES.map(m => (
              <div key={m.num} className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 flex items-start gap-5 hover:border-[#7C3AED]/60 transition-colors">
                <div className="text-3xl font-extrabold text-[#F59E0B] flex-shrink-0">{m.num}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
                  <p className="text-sm text-[#a5a0cc] mb-2">{m.desc}</p>
                  <div className="flex gap-4 text-xs text-[#6b6899]">
                    <span>📚 {m.lessons} lessons</span>
                    <span>⏱️ {m.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-xs text-[#10B981] font-bold uppercase tracking-wider mb-4">
              What's Included
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-3">
              Everything to Get Your First Sale. Fast.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INCLUDED.map(item => (
              <div key={item.title} className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl p-5 flex gap-4">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-[#a5a0cc]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MONEY BACK GUARANTEE BIG */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <div className="bg-gradient-to-r from-[#10B981]/10 to-[#7C3AED]/10 border-2 border-[#10B981]/40 rounded-3xl p-10 text-center">
            <div className="inline-block px-5 py-1.5 rounded-full bg-[#10B981] text-white text-sm font-extrabold mb-6">
              ✅ ZERO-RISK GUARANTEE
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-white mb-4">
              No Sales in 30 Days?<br />
              <span className="text-[#10B981]">Full Refund. Period.</span>
            </h2>
            <p className="text-lg text-[#a5a0cc] max-w-2xl mx-auto mb-8 leading-relaxed">
              Follow the course for 30 days. If you list at least 10 products and don't make a single sale, email{" "}
              <a href="mailto:support@unicornds.io" className="text-[#F59E0B] underline">support@unicornds.io</a>{" "}
              and we'll refund 100% of your money. No questions. No "are you sure?" emails. No hoops.
            </p>
            <p className="text-sm text-[#6b6899]">
              EcomSniper offers "30-day money back" but only if you don't use it.<br />
              <span className="text-white font-bold">We guarantee actual results.</span>
            </p>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-3">
              Mastery vs. EcomSniper Course
            </h2>
            <p className="text-[#a5a0cc]">Real numbers. Real features. You decide.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#0f0e1a]/60">
                  <th className="p-4 text-left text-sm text-[#a5a0cc] font-bold">Feature</th>
                  <th className="p-4 text-center text-sm font-extrabold text-[#F59E0B]">UnicornDS Mastery</th>
                  <th className="p-4 text-center text-sm text-[#6b6899] font-bold">EcomSniper</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["First Month Price", "£79.99 (20% off)", "$97 (~£77)"],
                  ["Monthly After", "£59.99", "$199 (~£158)"],
                  ["Money-Back Guarantee", "✅ If no sales in 30 days", "❌ 30-day refund only"],
                  ["Extension Listings/Month", "3,000", "3,000"],
                  ["Amazon Source", "✅", "✅"],
                  ["AliExpress Source", "✅", "❌"],
                  ["Course Hours", "13+ hours", "Unknown"],
                  ["Telegram Community", "✅", "✅"],
                  ["1-on-1 Onboarding Call", "✅ Included", "❌ Coaching is VIP only"],
                  ["UK Tax & HMRC Module", "✅", "❌ US-focused"],
                  ["Multi-Marketplace (DE/FR/AU/CA)", "✅", "❌"],
                ].map(([f, us, them]) => (
                  <tr key={f} className="border-t border-[#3d3580]/30">
                    <td className="p-3 text-[#a5a0cc]">{f}</td>
                    <td className="p-3 text-center text-white font-bold">{us}</td>
                    <td className="p-3 text-center text-[#6b6899]">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-3">
              Common Questions
            </h2>
          </div>

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

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#1E1B4B] to-[#2d2875] border border-[#F59E0B]/30 rounded-3xl p-10 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-4">
              Now That You Have <span className="text-[#10B981]">NO RISK</span>,<br />
              You Also Have <span className="text-[#F59E0B]">NO EXCUSES</span>...
            </h2>
            <p className="text-[#a5a0cc] mb-8 max-w-xl mx-auto">
              Start the course today. List your first product this week. If you don't make a sale in 30 days, we refund every penny.
            </p>
            <Link
              href="/checkout?plan=mastery"
              className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
            >
              🚀 Get UnicornDS Mastery — £{discountedFirst}
            </Link>
            <p className="mt-4 text-xs text-[#6b6899]">20% off first month · then £{monthlyAfter}/mo · cancel anytime · 30-day sales guarantee</p>
          </div>
        </section>
      </div>
    </>
  );
}
