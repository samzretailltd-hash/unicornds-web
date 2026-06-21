import Link from "next/link";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";
import { BlogSchema } from "@/components/BlogSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "eBay Dropshipping Tax UK 2026: VAT, Income Tax & What You Owe",
  description: "A plain-English guide to tax for UK eBay sellers in 2026 — the £1,000 trading allowance, Self Assessment, the £90,000 VAT threshold, Making Tax Digital, and HMRC platform reporting.",
  keywords: ["eBay tax UK", "eBay dropshipping tax", "do I pay tax on eBay sales", "eBay VAT threshold", "eBay HMRC reporting", "trading allowance eBay"],
};

export default function TaxUkArticle() {
  return (
    <>
      <BlogSchema
        title="eBay Dropshipping Tax UK 2026: VAT, Income Tax & What You Owe"
        description="A plain-English guide to tax for UK eBay sellers in 2026 — the £1,000 trading allowance, Self Assessment, the £90,000 VAT threshold, Making Tax Digital, and HMRC platform reporting."
        slug="ebay-dropshipping-tax-uk"
        publishedDate="2026-06-21"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.unicornds.io" },
        { name: "Blog", url: "https://www.unicornds.io/blog" },
        { name: "eBay Dropshipping Tax UK", url: "https://www.unicornds.io/blog/ebay-dropshipping-tax-uk" },
      ]} />
      <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-[#A78BFA] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-semibold">Tax</span>
            <span className="text-xs text-[#6b6899]">21 June 2026</span>
            <span className="text-xs text-[#6b6899]">10 min read</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4 leading-tight">eBay Dropshipping Tax UK 2026: VAT, Income Tax &amp; What You Owe</h1>
          <p className="text-lg text-[#a5a0cc] leading-relaxed">Tax is where a lot of new sellers get caught out. Here is a plain-English overview of the rules that apply to UK eBay sellers in 2026 &mdash; what you can earn before declaring, when VAT kicks in, and what HMRC already knows.</p>
        </div>

        <div className="space-y-6 text-[15px] text-[#c8c4e0] leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-white [&_a]:text-[#A78BFA] [&_a]:underline">

          <p className="text-sm italic text-[#8b88b0]">This is general information, not financial or tax advice. Rules and thresholds change &mdash; always confirm current figures on GOV.UK and speak to a qualified accountant about your situation.</p>

          <h2>The £1,000 Trading Allowance</h2>
          <p>You can earn up to <strong>£1,000 in gross trading income per tax year</strong> without registering for Self Assessment. This is the trading allowance. The moment your total sales (not profit) cross £1,000 in a tax year, you need to register with HMRC and declare. For anyone running eBay as a business, you will pass this almost immediately.</p>

          <h2>Income Tax &amp; Self Assessment</h2>
          <p>Once over the allowance, you register for <strong>Self Assessment</strong> and pay income tax on your <strong>profit</strong> &mdash; sales minus allowable costs (stock, eBay fees, postage, packaging, software, a portion of home and internet use). You pay tax at your normal income tax band on that profit, plus Class 4 National Insurance once profits pass the relevant threshold.</p>
          <p>Keep every figure. Good records are the difference between paying tax on profit and accidentally paying tax on turnover. Our <Link href="/blog/ebay-fees-calculator-2026">fees guide</Link> and <Link href="/blog/ebay-profit-margins-guide">margins guide</Link> help you track the numbers that feed your return.</p>

          <h2>The £90,000 VAT Threshold</h2>
          <p>If your taxable turnover passes <strong>£90,000 in any rolling 12-month period</strong>, you must register for VAT with HMRC within 30 days. This is turnover, not profit, and it rolls forward every month &mdash; so check the last 12 months at the end of each month, not just at year end. The deregistration threshold sits at £88,000. These figures have applied since April 2024.</p>
          <p>VAT registration is a big step for a dropshipper because you then charge 20% VAT on sales, which either eats your margin or raises your prices. Plan for it before you get there.</p>

          <h2>Making Tax Digital (From April 2026)</h2>
          <p>From <strong>April 2026</strong>, sellers with combined self-employment and property income above <strong>£50,000</strong> must follow Making Tax Digital for Income Tax &mdash; keeping digital records and submitting quarterly updates to HMRC using compatible software, instead of one annual return. The threshold steps down to lower income levels in later years, so it is worth getting digital records in place early.</p>

          <h2>HMRC Already Sees Your Sales</h2>
          <p>This is the part many sellers miss: online marketplaces including eBay now report seller data to HMRC under digital platform reporting rules. If you sell above the reporting limits, HMRC receives your sales figures directly. &quot;They will never know&quot; is no longer a strategy &mdash; the data is shared automatically. Declaring properly is the only safe route.</p>

          <h2>Selling to the EU &amp; Other Markets</h2>
          <p>Expanding to <Link href="/blog/ebay-dropshipping-germany-guide">Germany</Link>, France, or other markets brings extra rules &mdash; notably EU VAT and the €10,000 cross-border B2C threshold, plus import VAT and IOSS. Cross-border tax is complex; get specialist advice before you scale into new countries.</p>

          <h2>Stay Organised From Day One</h2>
          <p>The sellers who never panic about tax are the ones who track every sale, fee, and cost as they go. <Link href="/">UnicornDS</Link> keeps your listings, fees, and pricing organised so the numbers your accountant needs are already in one place &mdash; not scrambled together the night before a deadline.</p>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#7C3AED]/20 border border-[#10B981]/30">
            <h3 className="text-white text-lg font-bold mb-2">Keep Your Numbers Clean as You Scale</h3>
            <p className="text-sm text-[#a5a0cc] mb-4">UnicornDS organises your listings, fees, and pricing so the figures behind your tax return are accurate and easy to pull.</p>
            <Link href="/pricing" className="inline-block px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm hover:bg-[#6D28D9] transition-colors">Try UnicornDS Free &rarr;</Link>
          </div>
          <RelatedArticles currentSlug="ebay-dropshipping-tax-uk" tags={["pricing", "profits", "strategy"]} />
        </div>
      </div>
    </article>
  </>
    );
}
