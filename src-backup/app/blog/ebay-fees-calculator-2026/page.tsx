import Link from "next/link";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";
import { BlogSchema } from "@/components/BlogSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "eBay Fees Calculator 2026: Know Your True Profit Before Listing | UnicornDS",
  description: "Complete breakdown of eBay fees in 2026. Final value fees, promoted listing costs, payment processing, and how to calculate your real profit per sale.",
  keywords: ["ebay fees calculator", "ebay fees 2026", "ebay final value fee", "ebay selling fees", "ebay fee calculator uk"],
};

export default function Article() {
  return (
    <>
            <BlogSchema
        title="eBay Fees Calculator 2026: Know Your True Profit Before Listing"
        description="Complete breakdown of eBay fees in 2026. Final value fees, promoted listing costs, payment processing, and how to calculate your real profit per sale."
        slug="ebay-fees-calculator-2026"
        publishedDate="2026-04-11"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.unicornds.io" },
        { name: "Blog", url: "https://www.unicornds.io/blog" },
        { name: "eBay Fees Calculator 2026", url: "https://www.unicornds.io/blog/ebay-fees-calculator-2026" },
      ]} />
      <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-[#A78BFA] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>Pricing</span>
            <span className="text-xs text-[#6b6899]">11 April 2026</span>
            <span className="text-xs text-[#6b6899]">8 min</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4 leading-tight">eBay Fees Calculator 2026: Know Your True Profit Before Listing</h1>
          <p className="text-lg text-[#a5a0cc] leading-relaxed">Complete breakdown of eBay fees in 2026. Final value fees, promoted listing costs, payment processing, and how to calculate your real profit per sale.</p>
        </div>

        <div className="space-y-6 text-[15px] text-[#c8c4e0] leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-white [&_a]:text-[#A78BFA] [&_a]:underline">

          <h2>eBay Fees Breakdown 2026</h2>
          <p>Understanding eBay&apos;s fee structure is essential for profitable selling. Many new sellers are surprised by how much eBay takes from each sale. Here is the complete breakdown for 2026.</p>

          <h2>Final Value Fees</h2>
          <p>The final value fee is eBay&apos;s main charge. It applies to the total sale amount including shipping. For most categories, the final value fee is 12.8% plus £0.30 per order in the UK, or 13.25% plus $0.30 in the US. Some categories have different rates — electronics and fashion may have slightly different percentages.</p>

          <h2>Payment Processing Fees</h2>
          <p>eBay manages payments directly and charges a payment processing fee that is included in the final value fee. There is no separate PayPal fee since eBay moved to managed payments.</p>

          <h2>Promoted Listing Fees</h2>
          <p>If you use promoted listings (recommended for new sellers), you pay an additional 2-15% of the sale price. This is only charged when a promoted listing results in a sale.</p>

          <h2>The Real Cost per Sale</h2>
          <p>Adding everything together, a typical eBay sale costs approximately 15-25% of the sale price in fees. Here is an example:</p>
          <p>Selling price: £20.00. Final value fee (12.8% + £0.30): £2.86. Promoted listing (5%): £1.00. Total fees: £3.86. After fees: £16.14. If your product cost is £8.00, your profit is £8.14 — a 40.7% profit margin.</p>

          <h2>The Pricing Formula</h2>
          <p><strong>Minimum sell price = Product cost / (1 - FVF% - Ad% - Profit%)</strong></p>
          <p>For example: £8 product cost, 12.8% FVF, 5% ads, 25% desired profit = £8 / (1 - 0.128 - 0.05 - 0.25) = £8 / 0.572 = £13.99 minimum sell price.</p>

          <h2>Automatic Fee Calculation</h2>
          <p>UnicornDS automatically calculates your selling price using this formula. Set your desired profit margin and ad rate in the settings, and the extension calculates the correct eBay price for every product — accounting for all fees automatically. No more spreadsheets or guesswork.</p>
          <p><Link href="/pricing">Calculate prices automatically with UnicornDS →</Link></p>

          <RelatedArticles currentSlug="ebay-fees-calculator-2026" tags={["pricing", "profits", "fees"]} />
        </div>
      </div>
    </article>
  </>
    );
}
