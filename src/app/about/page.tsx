import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About UnicornDS — Built by an eBay Seller, for eBay Sellers",
  description: "Meet Zohaib Hassan, founder of UnicornDS. Why a UK eBay seller built a Chrome extension to fix what other tools got wrong. Our story, mission, and team.",
  alternates: { canonical: "https://www.unicornds.io/about" },
  openGraph: {
    title: "About UnicornDS — Built by an eBay Seller, for eBay Sellers",
    description: "UK-built, UK-supported eBay dropshipping tool. Our story.",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UnicornDS",
  url: "https://www.unicornds.io",
  logo: "https://www.unicornds.io/logo.png",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Zohaib Hassan",
    jobTitle: "Founder & CEO",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manchester",
    addressCountry: "GB",
  },
  description: "UnicornDS is a Chrome extension that helps eBay sellers source from Amazon and AliExpress, list with AI, and scale their dropshipping business.",
  sameAs: [
    "https://www.unicornds.io",
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      <div className="pt-24 pb-20">
        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-sm text-[#A78BFA] font-bold mb-6">
            🇬🇧 Made in Manchester, UK
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] mb-6 leading-tight">
            Built by an eBay seller,<br />
            <span className="text-[#F59E0B]">for eBay sellers.</span>
          </h1>
          <p className="text-xl text-[#a5a0cc] max-w-2xl mx-auto leading-relaxed">
            UnicornDS started because I was frustrated. I&apos;m Zohaib — an eBay dropshipper in Manchester. None of the existing tools did what I needed. So I built one that did.
          </p>
        </section>

        {/* FOUNDER STORY */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#F59E0B] flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">
                ZH
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Zohaib Hassan</h2>
                <p className="text-[#a5a0cc] text-sm">Founder &amp; CEO · Manchester, UK</p>
                <p className="text-xs text-[#6b6899] mt-0.5">eBay seller since 2019 · Building UnicornDS since 2024</p>
              </div>
            </div>

            <div className="space-y-4 text-[#c4c0e0] leading-relaxed">
              <p>
                I started selling on eBay UK in 2019 as a side hustle. Within a year it was paying my rent. Within three years I was scaling to multiple stores.
              </p>
              <p>
                But the tools I was paying for — you know the names — were either too expensive, US-focused, or missing basic features. EcomSniper wanted $199/month and didn&apos;t even support AliExpress. AutoDS was confusing. ZIK was research only.
              </p>
              <p>
                I kept writing scripts and shortcuts to fix the gaps. Eventually I had a working Chrome extension just for me. Friends started asking to use it. Then their friends.
              </p>
              <p>
                In early 2024, I made it official. <strong className="text-white">UnicornDS</strong> launched as a paid Chrome extension. The mission was simple:
              </p>
              <div className="bg-[#0f0e1a]/60 border-l-4 border-[#F59E0B] p-5 my-6 rounded-r-lg">
                <p className="text-lg font-bold text-white italic">
                  &ldquo;Build the tool I wish I&apos;d had when I started — at a price an actual seller can afford, with the features they actually use.&rdquo;
                </p>
              </div>
              <p>
                That&apos;s why UnicornDS Starter is £29.99 instead of $97. Why we support both Amazon AND AliExpress. Why we include UK tax training (because most eBay sellers I know live in the UK). Why our Mastery course is FREE with Growth instead of being a separate $497 bundle.
              </p>
              <p>
                We&apos;re not the biggest tool. EcomSniper has more marketing money than we have engineers. But we&apos;re built by someone who still ships parcels at 6pm, still gets MC011 cases at midnight, still tracks every margin in a spreadsheet.
              </p>
              <p className="font-bold text-white">
                If you&apos;re an eBay seller and you&apos;ve been waiting for a tool that respects your time and wallet — welcome to UnicornDS.
              </p>
              <p className="text-[#a5a0cc] italic">
                — Zohaib
              </p>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <h2 className="text-3xl font-extrabold text-center text-white mb-10">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "💷", title: "Affordable for actual sellers", desc: "If you can't afford the tool, the tool isn't working. Our prices stay under £100/month because that's what real sellers can spend." },
              { icon: "🇬🇧", title: "UK-first, globally useful", desc: "VAT, HMRC, Royal Mail, eBay UK fees — we understand them because we sell here too. But UnicornDS works in US, DE, FR, AU, CA." },
              { icon: "🛡️", title: "Account safety > everything", desc: "Our 3,629-brand VERO list is the most thorough in the industry. A suspended account = zero revenue forever. We protect that above all else." },
              { icon: "🎓", title: "Teach, don't gatekeep", desc: "The full Mastery course is FREE with Growth. The blog is free. The glossary is free. The calculators are free. Knowledge shouldn't be paywalled." },
              { icon: "💯", title: "Guarantee results, not refunds", desc: "Most tools offer 30-day money back. We offer 30-day SALES guarantee. If you list 10 products and make zero sales, full refund. We bet on our work." },
              { icon: "🚫", title: "No bullshit, no upsells", desc: "Empire includes 1-on-1 calls. No surprise &ldquo;VIP coaching&rdquo; tier. No &ldquo;done-for-you&rdquo; $5K packages. What you see on /pricing is what you get." },
            ].map(v => (
              <div key={v.title} className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-xl p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-[#a5a0cc] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPANY INFO */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <div className="bg-[#1E1B4B]/40 border border-[#3d3580]/40 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Company Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">Founded</p>
                <p className="text-white">2024</p>
              </div>
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">HQ</p>
                <p className="text-white">Manchester, United Kingdom</p>
              </div>
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">Founder</p>
                <p className="text-white">Zohaib Hassan</p>
              </div>
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">Sellers Served</p>
                <p className="text-white">500+ active monthly</p>
              </div>
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">Support</p>
                <p className="text-white"><a href="mailto:support@unicornds.io" className="text-[#7C3AED] hover:underline">support@unicornds.io</a></p>
              </div>
              <div>
                <p className="text-[#6b6899] uppercase text-xs font-bold tracking-wider mb-1">Hours</p>
                <p className="text-white">UK business hours (we reply within 4h)</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#1E1B4B] to-[#2d2875] border border-[#F59E0B]/30 rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to try the tool I built for myself?
            </h2>
            <p className="text-[#a5a0cc] mb-8 max-w-xl mx-auto">
              7-day full access for £1. Cancel anytime. If you don&apos;t make a sale in 30 days after going paid, full refund. That&apos;s how confident I am.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/pricing" className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all">
                🚀 Start £1 Trial
              </Link>
              <a href="mailto:zohaib@unicornds.io" className="inline-block px-10 py-4 bg-[#1E1B4B] hover:bg-[#2d2875] border border-[#3d3580] text-white rounded-xl text-lg font-bold transition-all">
                Email Me Directly
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
