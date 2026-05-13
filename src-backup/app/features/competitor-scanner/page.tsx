import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Competitor Scanner — Spy on Top eBay Sellers & Copy Their Strategy',
  description: "Enter any eBay seller username and instantly see their entire product catalog. Find what's selling and source the same products.",
  keywords: ['ebay competitor research', 'ebay seller spy tool', 'ebay competitor analysis', 'ebay seller scanner', 'spy on ebay sellers'],
};

export default function CompetitorScannerPage() {
  return (
    <FeaturePageLayout
      badge="RESEARCH"
      badgeColor="bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20"
      title="Competitor Scanner"
      subtitle="See exactly what top eBay sellers are selling. Then sell it better."
      heroDescription="Why guess which products to sell when you can see exactly what is already working for successful sellers? Competitor Scanner lets you enter any eBay seller username and instantly extract their entire product catalog — titles, prices, categories, and listing counts. Find their best-selling items, identify the categories they dominate, and source the same products from Amazon or AliExpress. You are not copying them — you are validating demand with real data. Every successful product they sell is proof that buyers want that item on eBay."
      screenshotAlt="UnicornDS Competitor Scanner showing extracted seller product catalog"
      sections={[
        { icon: '🔍', title: 'Full Catalog Extraction', description: "Type any eBay seller username and extract every product they sell. Titles, prices, categories, and listing details — all visible in seconds." },
        { icon: '📊', title: 'Best Seller Identification', description: 'See which products have the most sales, watchers, and engagement. Focus on proven winners, not random guesses.' },
        { icon: '🔗', title: 'Find on AliExpress', description: 'One click to search AliExpress for the same product. Find the source, calculate your profit, and decide if it is worth listing.' },
        { icon: '📈', title: 'Category Analysis', description: 'See which categories a seller dominates. Spot niches with high demand and low competition.' },
        { icon: '💰', title: 'Price Comparison', description: 'Compare their prices with source costs to estimate their margins. Undercut them or find better-value alternatives.' },
        { icon: '🚀', title: 'Direct to Bulk Lister', description: 'Found products worth listing? Send them directly to the Bulk Lister queue for automated listing.' },
      ]}
      howItWorks={[
        'Find a successful eBay seller in your niche. You can find usernames on any eBay listing page.',
        'Enter their username in Competitor Scanner. The extension extracts their entire product catalog.',
        'Analyse their products: which categories are they in? What price range? Which items sell most?',
        'Click "Find on AliExpress" to find source products. Calculate your profit using the built-in calculator.',
        'Select winners and send them to the Bulk Lister. List the same products with better titles and descriptions.',
      ]}
      ctaText="Start scanning competitors"
    />
  );
}
