import Link from "next/link";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";
import { BlogSchema } from "@/components/BlogSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "eBay Out-of-Stock Control 2026: Avoid Cancellations & Defects",
  description: "Selling an item that's gone out of stock at your supplier triggers cancellations and defects that can suspend your eBay account. Here's how to monitor stock and price changes and stay safe.",
  keywords: ["eBay out of stock", "dropshipping cancellations eBay", "eBay defect rate", "stock monitoring dropshipping", "avoid eBay cancellations"],
};

export default function OutOfStockArticle() {
  return (
    <>
      <BlogSchema
        title="eBay Out-of-Stock Control 2026: Avoid Cancellations & Defects"
        description="Selling an item that's gone out of stock at your supplier triggers cancellations and defects that can suspend your eBay account. Here's how to monitor stock and price changes and stay safe."
        slug="ebay-out-of-stock-control"
        publishedDate="2026-06-21"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.unicornds.io" },
        { name: "Blog", url: "https://www.unicornds.io/blog" },
        { name: "eBay Out-of-Stock Control", url: "https://www.unicornds.io/blog/ebay-out-of-stock-control" },
      ]} />
      <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-[#A78BFA] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] text-xs font-semibold">Operations</span>
            <span className="text-xs text-[#6b6899]">21 June 2026</span>
            <span className="text-xs text-[#6b6899]">8 min read</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4 leading-tight">eBay Out-of-Stock Control: Avoid Cancellations &amp; Defects</h1>
          <p className="text-lg text-[#a5a0cc] leading-relaxed">The fastest way to lose an eBay account is selling things you cannot fulfil. When your supplier sells out or hikes the price, every order becomes a cancellation. Here is how to stay in control of stock you do not hold.</p>
        </div>

        <div className="space-y-6 text-[15px] text-[#c8c4e0] leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-white [&_a]:text-[#A78BFA] [&_a]:underline">

          <h2>Why Out-of-Stock Is So Dangerous</h2>
          <p>If you sell an item and then find your supplier is out of stock, you have to cancel the order. eBay records a seller-initiated cancellation as a defect. A few of those and your <Link href="/blog/avoid-ebay-suspension-dropshipping">account is throttled or suspended</Link>. Unlike a one-off mistake, out-of-stock issues repeat across your whole catalogue if you are not watching.</p>

          <h2>The Two Things That Change Under You</h2>
          <p><strong>Availability.</strong> A supplier sells out or delists the product. Your listing is still live, so buyers keep ordering something you cannot get.</p>
          <p><strong>Price.</strong> The supplier raises the price. Your listing still shows the old price, so every sale now loses money. This is just as damaging as a stockout &mdash; you either eat the loss or cancel.</p>

          <h2>How to Stay Ahead of It</h2>

          <h3>1. Monitor your source listings</h3>
          <p>Check that each product is still in stock and at the expected price. Doing this by hand across hundreds of listings is impossible, which is why monitoring needs to be systematic.</p>

          <h3>2. End or pause listings quickly</h3>
          <p>The moment a source goes out of stock, end or hide your listing so no new orders come in. A listing you cannot fulfil is a liability, not an asset.</p>

          <h3>3. Update prices when costs move</h3>
          <p>If your supplier raises the price, reprice or pause &mdash; never keep selling at a loss. Build a margin buffer so small cost rises do not immediately turn a product unprofitable.</p>

          <h3>4. Diversify suppliers</h3>
          <p>For your best sellers, know a backup source. If one runs out, you can switch instead of cancelling. This single habit prevents most stockout cancellations.</p>

          <h2>Build a Margin Buffer</h2>
          <p>Pricing with a healthy margin gives you room to absorb a small supplier price rise without cancelling or losing money. Thin margins leave no cushion, so a tiny cost change forces a bad choice. See our <Link href="/blog/ebay-profit-margins-guide">margins guide</Link>.</p>

          <h2>Source and Track Smarter</h2>
          <p>Out-of-stock control is really about visibility &mdash; knowing what changed before a buyer finds out. <Link href="/">UnicornDS</Link> helps you source reliable products and keep your listings organised, so you can act on stock and price changes fast instead of discovering them at cancellation time.</p>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#7C3AED]/20 border border-[#F59E0B]/30">
            <h3 className="text-white text-lg font-bold mb-2">Stay in Control of Stock You Don&apos;t Hold</h3>
            <p className="text-sm text-[#a5a0cc] mb-4">Source reliable products and keep listings organised with UnicornDS, so price and stock changes never turn into cancellations.</p>
            <Link href="/pricing" className="inline-block px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm hover:bg-[#6D28D9] transition-colors">Try UnicornDS Free &rarr;</Link>
          </div>
          <RelatedArticles currentSlug="ebay-out-of-stock-control" tags={["account", "strategy", "sourcing"]} />
        </div>
      </div>
    </article>
  </>
    );
}
