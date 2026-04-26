import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Demand Score & eBay Sold Check — Data-Driven Product Selection',
  description: 'Every product scored 0-100 for demand. Check eBay sold listings before listing: sold count, average price, competitor count. Stop guessing.',
  keywords: ['ebay demand score', 'ebay sold check', 'product demand tool', 'ebay sales checker', 'ebay competition analysis'],
};

export default function DemandScorePage() {
  return (
    <FeaturePageLayout
      badge="INTELLIGENCE"
      badgeColor="bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/20"
      title="Demand Score & eBay Sold Check"
      subtitle="Know which products sell BEFORE you list them. Data, not guesswork."
      heroDescription="The #1 reason dropshippers fail is listing products nobody wants. Demand Score solves this by scoring every product 0-100 based on real data: review count (40 points), rating quality (25 points), Amazon's Choice badge (15 points), Best Seller badge (15 points), and trending indicators (10 points). But the real game-changer is the eBay Sold Check: it searches eBay's completed listings and shows you exactly how many units sold in the last 90 days, the average sold price, and how many competitors are already selling it. Now you can compare products side-by-side and pick the ones with the best combination of high demand and low competition."
      screenshotAlt="UnicornDS Demand Score showing product scores and eBay sold data"
      sections={[
        { icon: '📊', title: 'Demand Score (0-100)', description: 'Instant scoring: 🔥 70-100 = Hot Demand, 🌤 40-69 = Warm, ❄️ 0-39 = Cold. Based on reviews, rating, Amazon badges, and trending data.' },
        { icon: '🏷️', title: 'eBay Sold Check', description: 'Checks eBay completed listings for each product. Shows sold count, average sold price, and active competitor count — all before you list.' },
        { icon: '💰', title: 'Competitor Price Bar', description: 'See lowest, highest, average, and suggested undercut price across all eBay sellers for any product. Know your pricing sweet spot.' },
        { icon: '🎯', title: 'Smart Filtering', description: 'Sort Product Hunter results by Demand Score. Filter out cold products instantly and focus only on proven winners.' },
        { icon: '📱', title: 'Amazon Page Integration', description: 'Demand Score also appears on Amazon product pages. See the score while browsing — no need to open Product Hunter separately.' },
        { icon: '📈', title: 'Trend Detection', description: 'Products with recent purchase indicators ("1K+ bought in past month") get bonus points. Ride trends early.' },
      ]}
      howItWorks={[
        'Search in Product Hunter — every result automatically shows its Demand Score (0-100) with a colour-coded icon.',
        'Click "Check eBay Sales" to check all products against eBay sold listings. This takes about 4 seconds per product.',
        'Each product now shows: sold count (how many sold in 90 days), average sold price (what buyers pay), and competitor count (how many sellers).',
        'Compare products: look for high demand score (70+), good sold count (20+ per month), and reasonable competition (under 500 sellers).',
        'Select the best products and transfer to Bulk Lister. You are now listing products with PROVEN demand.',
      ]}
      ctaText="Start making data-driven decisions"
    />
  );
}
