import Link from "next/link";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";
import { BlogSchema } from "@/components/BlogSchema";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "eBay Prohibited & Restricted Items UK: The Complete 2026 Seller Guide",
  description: "What you can and cannot sell on eBay UK in 2026. The difference between prohibited and restricted items, the categories most likely to get you suspended, and how dropshippers stay safe.",
  keywords: ["eBay prohibited items", "eBay restricted items UK", "what can't you sell on eBay", "eBay banned items", "eBay selling rules 2026"],
};

export default function ProhibitedItemsArticle() {
  return (
    <>
      <BlogSchema
        title="eBay Prohibited & Restricted Items UK: The Complete 2026 Seller Guide"
        description="What you can and cannot sell on eBay UK in 2026. The difference between prohibited and restricted items, the categories most likely to get you suspended, and how dropshippers stay safe."
        slug="ebay-prohibited-restricted-items-uk"
        publishedDate="2026-06-21"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.unicornds.io" },
        { name: "Blog", url: "https://www.unicornds.io/blog" },
        { name: "eBay Prohibited & Restricted Items UK", url: "https://www.unicornds.io/blog/ebay-prohibited-restricted-items-uk" },
      ]} />
      <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-[#A78BFA] hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-xs font-semibold">Compliance</span>
            <span className="text-xs text-[#6b6899]">21 June 2026</span>
            <span className="text-xs text-[#6b6899]">10 min read</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4 leading-tight">eBay Prohibited &amp; Restricted Items UK: The Complete 2026 Guide</h1>
          <p className="text-lg text-[#a5a0cc] leading-relaxed">One restricted listing can cost you a strike. Three strikes can cost you your account. Here is a plain-English map of what eBay UK bans outright, what it restricts, and where dropshippers get caught.</p>
        </div>

        <div className="space-y-6 text-[15px] text-[#c8c4e0] leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_strong]:text-white [&_a]:text-[#A78BFA] [&_a]:underline">

          <h2>Prohibited vs Restricted: Know the Difference</h2>
          <p><strong>Prohibited</strong> means you cannot list it at all, ever. Weapons, drugs, live animals, stolen goods, recalled products. No exceptions, and the penalty is immediate.</p>
          <p><strong>Restricted</strong> means it can be sold, but only under conditions &mdash; age verification, licences, safety marking, or being an approved seller. Alcohol, some bladed tools, certain electronics. The problem for dropshippers is that you usually cannot meet the conditions, so in practice these behave like prohibited items for you.</p>

          <h2>Outright Prohibited (Never List)</h2>
          <p>Firearms, ammunition, and realistic imitation guns. Offensive weapons such as knuckle dusters, push daggers, zombie knives, and disguised blades. Drugs, drug paraphernalia, and most CBD. Prescription medicines. Tobacco and e-cigarettes with nicotine. Counterfeit goods. Recalled products such as cot bumpers and infant sleep positioners. Government IDs and stolen property.</p>

          <h2>Restricted (Conditions Apply &mdash; Usually Out of Reach for Dropshippers)</h2>
          <p>Alcohol (licensed sellers only). Bladed and sharp items (age-verified delivery plus UK stock). Most cosmetics and skincare (ingredient and safety compliance). Supplements and anything ingestible. Batteries and electricals (UKCA marking). Baby and child products (safety standards). Veterinary and pet-health products. Hazardous and flammable goods such as aerosols and butane.</p>

          <h2>Where Dropshippers Get Caught</h2>
          <p>It is rarely the obvious stuff. Sellers do not try to list firearms. They get burned on innocent-looking products that fall inside a restricted category: a phone charger (battery rules), a cute teether (child safety), a bottle of perfume (cosmetics), a multi-tool with a small blade, a tub of gummies (supplements). The product seems harmless, but the category is regulated.</p>
          <p>This is the same long tail captured in our <Link href="/blog/ebay-restricted-words-list-2026">eBay restricted words list</Link>. Pair it with the <Link href="/blog/ebay-vero-list-2026">VERO brand list</Link> and you cover both the policy risk and the brand risk.</p>

          <h2>What Happens If You List One</h2>
          <p>Best case, the listing is blocked or removed. Worse case, you receive a policy violation that becomes a defect on your account. Stack a few of these and eBay throttles your selling limits, suppresses your listings in search, or suspends you. New accounts are watched most closely, so early mistakes hurt the most. Our guide on <Link href="/blog/avoid-ebay-suspension-dropshipping">avoiding eBay suspension</Link> covers the recovery side.</p>

          <h2>How to Stay Safe</h2>
          <p>Build a habit of category-checking before sourcing, not after listing. Favour lightly regulated niches: home and kitchen storage, garden (non-bladed), pet accessories (not health), stationery, phone and laptop accessories without batteries, and gift items. Screen every title and description against the restricted-words list, and when a flagged word is the product itself, skip it.</p>
          <p>At scale, automate the check. <Link href="/">UnicornDS</Link> screens each product against the eBay UK restricted-words list and the VERO brand list before you list, so you never rely on memory.</p>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#EF4444]/20 to-[#7C3AED]/20 border border-[#EF4444]/30">
            <h3 className="text-white text-lg font-bold mb-2">Check Every Product Before You List</h3>
            <p className="text-sm text-[#a5a0cc] mb-4">Built-in restricted-words and VERO screening flags prohibited and restricted items before eBay does &mdash; protecting your selling limits and your account.</p>
            <Link href="/pricing" className="inline-block px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm hover:bg-[#6D28D9] transition-colors">Protect My Account &rarr;</Link>
          </div>
          <RelatedArticles currentSlug="ebay-prohibited-restricted-items-uk" tags={["compliance", "vero", "account"]} />
        </div>
      </div>
    </article>
  </>
    );
}
