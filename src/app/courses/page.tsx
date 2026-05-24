import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UnicornDS Mastery — Free eBay Dropshipping Course with Growth & Empire | UnicornDS",
  description: "Complete eBay dropshipping course in English & Urdu — FREE with UnicornDS Growth or Empire. 8 modules, 49 lessons, private Telegram community. 100% money-back if no sales in 30 days.",
  alternates: { canonical: "https://www.unicornds.io/courses" },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "UnicornDS Mastery — eBay Dropshipping Course",
  description: "Complete eBay dropshipping training included free with UnicornDS Growth (£59.99/mo) or Empire (£99.99/mo) plans.",
  provider: { "@type": "Organization", name: "UnicornDS", url: "https://www.unicornds.io" },
  offers: { "@type": "Offer", price: "59.99", priceCurrency: "GBP", url: "https://www.unicornds.io/pricing" },
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
  { icon: "🎓", title: "Complete Video Course", desc: "8 modules, 49 lessons, 13+ hours of HD training. Updated for 2026." },
  { icon: "🇬🇧🇵🇰", title: "English & Urdu Available", desc: "Every lesson recorded in both English and Roman Urdu. Switch language anytime in your dashboard." },
  { icon: "🚀", title: "UnicornDS Extension", desc: "Growth = 1,500 listings/mo. Empire = 3,000 listings/mo + MSKU builder." },
  { icon: "💬", title: "Private Telegram Community", desc: "Direct chat with other sellers + our team. Answers in minutes." },
  { icon: "📞", title: "1-on-1 Onboarding (Empire)", desc: "30-min setup call with our team. Empire tier only." },
  { icon: "📊", title: "Done-For-You Templates", desc: "Pre-built listing templates, message templates, store policies — copy and use." },
  { icon: "🛡️", title: "VERO Brand Blacklist", desc: "Live-updated list of 3,629 restricted brands. Auto-checks every listing." },
  { icon: "🎯", title: "Winning Products List", desc: "Monthly updated list of 50+ proven products with demand scores." },
  { icon: "💎", title: "Lifetime Course Updates", desc: "eBay changes constantly. Every algorithm update, we update the course. Free, forever." },
];

const FAQ = [
  { q: "How do I get the Mastery course?", a: "It's automatically included FREE with any Growth (£59.99/mo) or Empire (£99.99/mo) subscription. Once you subscribe, course access unlocks immediately in your dashboard. Starter plan does NOT include the course." },
  { q: "What if I don't make any sales in 30 days?", a: "100% money back. If you follow the course, list at least 10 products, and don't make a single sale within 30 days, email us and we refund every penny. No questions, no fine print." },
  { q: "Do I need any experience?", a: "No. The course starts from zero — opening your eBay account, setting up payments, choosing your first product. By module 3 you'll list your first product. By module 6 you'll be scaling to £1K/month." },
  { q: "What's the difference between Growth and Empire course access?", a: "Same course content — all 8 modules, all 49 lessons. Empire adds: 1-on-1 onboarding call, VIP Telegram channel with priority responses, and direct WhatsApp access to the team." },
  { q: "How much can I realistically earn?", a: "Honest answer: depends on your effort. Following the course full-time, most students hit £1,000/mo profit in month 2, £3,000-5,000/mo by month 4. Some scale to £10K+. None of this is passive — but the systems make it efficient." },
  { q: "Do I need to buy stock upfront?", a: "No. Dropshipping means you only buy from the supplier AFTER your eBay buyer pays you. Zero inventory risk. You need ~£100-200 buffer for the day between buyer payment and supplier shipping." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard any time. Course access continues until end of billing period. No contracts, no penalties." },
  { q: "Is this UK only?", a: "No. Course covers eBay UK, US, DE, FR, AU, and CA. International sourcing from Amazon (all regions) and AliExpress." },
];

export default function CoursesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <div className="pt-28 pb-20">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-16">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-sm text-[#10B981] font-bold mb-6">
            ✨ INCLUDED FREE with Growth &amp; Empire
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
            Learn eBay Dropshipping<br />
            <span className="text-[#F59E0B]">From Zero to £10K/Month</span>
          </h1>

          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto mb-8 leading-relaxed">
            8 modules · 49 lessons · 13+ hours of training. <strong className="text-white">Included free</strong> when you subscribe to UnicornDS Growth or Empire — no extra cost.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-full px-5 py-2 text-[#10B981] text-sm font-bold flex items-center gap-2">
              ✅ 100% Money-Back If No Sales in 30 Days
            </div>
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-full px-5 py-2 text-[#A78BFA] text-sm font-bold">
              💬 Private Telegram Community
            </div>
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-5 py-2 text-[#F59E0B] text-sm font-bold">
              📞 1-on-1 Onboarding (Empire)
            </div>
          </div>

          {/* PLAN ACCESS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <div className="bg-[#1E1B4B] border-2 border-[#7C3AED] rounded-2xl p-7 text-left relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-extrabold px-4 py-1 rounded-full tracking-wider">MOST POPULAR</span>
              <div className="text-2xl font-bold text-white mb-1">Growth</div>
              <div className="text-3xl font-extrabold text-[#F59E0B] mb-1">£59.99<span className="text-sm font-normal text-[#a5a0cc]">/mo</span></div>
              <div className="text-xs text-[#10B981] font-bold mb-4">✓ Course included FREE</div>
              <ul className="text-xs text-[#a5a0cc] space-y-1.5 mb-5">
                <li>✓ 1,500 listings/month</li>
                <li>✓ Full Mastery course (8 modules)</li>
                <li>✓ Private Telegram community</li>
                <li>✓ Bulk Lister (5 concurrent)</li>
                <li>✓ All extension features</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-[#7C3AED] hover:bg-[#9333EA] text-white text-center rounded-xl text-sm font-bold transition-all">
                Get Growth + Course →
              </Link>
            </div>

            <div className="bg-[#1E1B4B] border-2 border-[#F59E0B] rounded-2xl p-7 text-left relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#1E1B4B] text-[10px] font-extrabold px-4 py-1 rounded-full tracking-wider">BEST FOR SCALE</span>
              <div className="text-2xl font-bold text-white mb-1">Empire</div>
              <div className="text-3xl font-extrabold text-[#F59E0B] mb-1">£99.99<span className="text-sm font-normal text-[#a5a0cc]">/mo</span></div>
              <div className="text-xs text-[#10B981] font-bold mb-4">✓ Course + VIP perks</div>
              <ul className="text-xs text-[#a5a0cc] space-y-1.5 mb-5">
                <li>✓ 3,000 listings/month</li>
                <li>✓ Full Mastery course (8 modules)</li>
                <li>✓ VIP Telegram + WhatsApp access</li>
                <li>✓ 1-on-1 onboarding call</li>
                <li>✓ MSKU builder + everything else</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] text-center rounded-xl text-sm font-bold transition-all">
                Get Empire + Course →
              </Link>
            </div>
          </div>

          <p className="mt-6 text-sm text-[#a5a0cc]">
            On <strong className="text-white">Starter</strong>? <Link href="/pricing" className="text-[#F59E0B] underline">Upgrade to Growth</Link> to unlock the course.
          </p>
          <p className="mt-3 text-xs text-[#6b6899]">
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
              and we'll refund 100% of your subscription. No questions. No "are you sure?" emails. No hoops.
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
              UnicornDS Growth vs. EcomSniper
            </h2>
            <p className="text-[#a5a0cc]">Same outcome. Half the price. Better guarantee.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#0f0e1a]/60">
                  <th className="p-4 text-left text-sm text-[#a5a0cc] font-bold">Feature</th>
                  <th className="p-4 text-center text-sm font-extrabold text-[#F59E0B]">UnicornDS Growth</th>
                  <th className="p-4 text-center text-sm text-[#6b6899] font-bold">EcomSniper</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["Monthly Price", "£59.99", "$199 (~£158)"],
                  ["Course Included", "✅ FREE", "❌ Course = bundle only"],
                  ["Money-Back Guarantee", "✅ If no sales in 30 days", "❌ 30-day refund only"],
                  ["Extension Listings/Month", "1,500", "3,000"],
                  ["Amazon Source", "✅", "✅"],
                  ["AliExpress Source", "✅", "❌"],
                  ["Course Hours", "13+ hours", "Unknown"],
                  ["Telegram Community", "✅", "✅"],
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
              Subscribe to Growth or Empire today. List your first product this week. If you don't make a sale in 30 days, we refund every penny.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
            >
              🚀 See Plans &amp; Get the Course
            </Link>
            <p className="mt-4 text-xs text-[#6b6899]">From £59.99/mo · cancel anytime · 30-day sales guarantee</p>
          </div>
        </section>
      </div>
    </>
  );
}
