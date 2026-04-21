import Link from "next/link";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";
import { BlogSchema } from "@/components/BlogSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "eBay Shipping Guide 2026: Best Carriers, Costs & Settings for UK Sellers | UnicornDS",
  description: "Complete UK eBay shipping guide covering Royal Mail, Evri, DPD costs, handling times for dropshipping, tracked vs untracked, and how to set up shipping policies correctly.",
  keywords: ["eBay shipping guide", "eBay shipping UK", "eBay shipping settings", "dropshipping shipping times", "eBay Royal Mail", "eBay tracked shipping"],
};

export default function ShippingArticle() {
  return (
    <>
            <BlogSchema
        title="eBay Shipping Guide 2026: Best Carriers, Costs & Settings for UK Sellers"
        description="Complete UK eBay shipping guide covering Royal Mail, Evri, DPD costs, handling times for dropshipping, tracked vs untracked, and how to set up shipping policies correctly."
        slug="ebay-shipping-guide-uk"
        publishedDate="2026-04-10"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.unicornds.io" },
        { name: "Blog", url: "https://www.unicornds.io/blog" },
        { name: "eBay Shipping Guide 2026", url: "https://www.unicornds.io/blog/ebay-shipping-guide-uk" },
      ]} />
      <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-[#A78BFA] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-semibold">Shipping</span>
            <span className="text-xs text-[#6b6899]">10 April 2026</span>
            <span className="text-xs text-[#6b6899]">8 min read</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4 leading-tight">eBay Shipping Guide 2026: Best Carriers and Settings for UK Sellers</h1>
          <p className="text-lg text-[#a5a0cc] leading-relaxed">Shipping is the most misunderstood part of eBay dropshipping. Get it wrong and you lose your account. Get it right and it becomes your competitive advantage.</p>
        </div>

        <div className="space-y-6 text-[15px] text-[#c8c4e0] leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-white [&_a]:text-[#A78BFA] [&_a]:underline">

          <h2>Dropshipping Shipping: How It Actually Works</h2>
          <p>When you dropship, you do not ship anything yourself. Your supplier ships directly to your eBay buyer. But eBay does not know this. As far as eBay is concerned, you are the seller and you are responsible for shipping.</p>
          <p>This means you need to set handling times and shipping speeds that match your supplier, then upload tracking numbers when the supplier ships.</p>

          <h2>Amazon Arbitrage Shipping (UK)</h2>
          <p>Amazon Prime offers next-day or same-day delivery. This is your biggest advantage over AliExpress dropshippers.</p>
          <p><strong>Recommended eBay settings for Amazon sourcing:</strong></p>
          <p><strong>Handling time:</strong> 1 business day. You need to order from Amazon within 24 hours of the eBay sale.</p>
          <p><strong>Shipping service:</strong> Standard delivery (2 to 5 business days). Even though Amazon delivers faster, setting a longer window gives you a buffer.</p>
          <p><strong>Tracking:</strong> Amazon provides tracking for all orders. Upload this to eBay immediately. This is critical for seller protection. UnicornDS Order Manager makes this one click.</p>

          <h2>AliExpress Shipping (International)</h2>
          <p>AliExpress shipping to the UK typically takes 10 to 25 business days, sometimes longer. This is the biggest challenge with AliExpress dropshipping.</p>
          <p><strong>Recommended eBay settings for AliExpress sourcing:</strong></p>
          <p><strong>Handling time:</strong> 5 business days. This gives you time to order and for AliExpress to process.</p>
          <p><strong>Shipping service:</strong> Economy international (15 to 30 business days).</p>
          <p><strong>Tracking:</strong> Always choose AliExpress shipping options that include tracking. Pay the extra for tracked shipping. Without tracking, you have no buyer protection if a customer claims they never received the item.</p>

          <h2>Free Shipping vs Paid Shipping</h2>
          <p><strong>Always offer free shipping.</strong> eBay ranks free shipping listings higher in search results. The cost of shipping is built into your sell price anyway. Buyers prefer seeing £15.99 with free shipping over £12.99 plus £3 shipping, even though they pay the same total.</p>
          <p>Remember that eBay charges final value fees on the total amount including shipping. So separating the price does not save you any fees.</p>

          <h2>Tracked vs Untracked</h2>
          <p><strong>For items over £10: always use tracked shipping.</strong> If a buyer opens an &quot;Item not received&quot; case and you have no tracking proof, eBay sides with the buyer every time. You lose the item and the money.</p>
          <p>For items under £10, untracked can work but you accept the risk that some buyers will claim non-delivery. Factor a 2% to 3% loss rate into your pricing.</p>

          <h2>Handling Late Shipment Defects</h2>
          <p>eBay tracks your &quot;late shipment rate&quot;. If more than 3% of your orders ship late (based on your stated handling time), your account gets restricted.</p>
          <p><strong>The fix:</strong> Set longer handling times than you need. If you usually order from Amazon within 2 hours, set handling time to 1 business day. This gives you a buffer for weekends, bank holidays, and unexpected delays.</p>

          <h2>International Shipping from UK</h2>
          <p>Selling internationally massively increases your buyer pool. eBay Global Shipping Programme handles customs and duties for you.</p>
          <p><strong>How it works:</strong> You ship to eBay&#39;s UK hub (Hoddesdon, Hertfordshire). eBay forwards it internationally. The buyer pays international shipping and import duties at checkout. You only pay domestic shipping to the hub.</p>

          <h2>Setting Up Shipping Policies</h2>
          <p>Create shipping policies in eBay Seller Hub so you do not have to set shipping for every listing individually:</p>
          <p><strong>Policy 1 - Amazon Sourced:</strong> Free standard shipping, 1 day handling, Royal Mail or Evri tracked</p>
          <p><strong>Policy 2 - AliExpress Sourced:</strong> Free economy shipping, 5 day handling, economy international</p>
          <p>Apply the correct policy to each listing. UnicornDS lets you set this per product source so it is applied automatically.</p>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#7C3AED]/20 to-[#2563EB]/20 border border-[#7C3AED]/30">
            <h3 className="text-white text-lg font-bold mb-2">Automate Your Shipping Workflow</h3>
            <p className="text-sm text-[#a5a0cc] mb-4">UnicornDS Order Manager tracks eBay sales, matches them to Amazon orders, and uploads tracking numbers in one click. Never miss a shipping deadline again.</p>
            <Link href="/pricing" className="inline-block px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm hover:bg-[#6D28D9] transition-colors">Try Order Manager Free &rarr;</Link>
          </div>
          <RelatedArticles currentSlug="ebay-shipping-guide-uk" tags={["shipping", "uk", "logistics"]} />
        </div>
      </div>
    </article>
  </>
    );
}
