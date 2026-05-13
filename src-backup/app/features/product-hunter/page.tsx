import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Product Hunter — Find Winning Products for eBay Dropshipping',
  description: 'Search Amazon by keyword, see Demand Score for every product, check eBay sold data before listing. Find products that actually sell on eBay.',
  keywords: ['ebay product research', 'amazon product finder', 'ebay dropshipping products', 'product hunter tool', 'demand score ebay'],
};

export default function ProductHunterPage() {
  return (
    <FeaturePageLayout
      badge="PRODUCT RESEARCH"
      badgeColor="bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/20"
      title="Product Hunter"
      subtitle="Stop guessing. Find products with proven demand and real eBay sales data."
      heroDescription="Product Hunter searches Amazon by keyword and shows you everything you need to decide whether a product is worth listing on eBay. Every result includes a Demand Score (0-100), review count, rating, price, and Amazon badges. But the real power is the eBay Sold Check — click one button and see exactly how many units sold on eBay in the last 90 days, the average sold price, and how many competitors are already selling it. No more listing products that sit unsold for months."
      screenshotAlt="UnicornDS Product Hunter showing Amazon search results with Demand Score and eBay sold data"
      sections={[
        { icon: '🎯', title: 'Amazon Keyword Search', description: 'Search any keyword across Amazon UK, US, DE, FR, AU, CA. Filter by price range, minimum reviews, and Prime eligibility.' },
        { icon: '📊', title: 'Demand Score (0-100)', description: 'Every product scored instantly. Based on review count, rating, Amazon badges (Choice, Best Seller), and trending data. 70+ = Hot, 40-69 = Warm, below 40 = Cold.' },
        { icon: '🏷️', title: 'eBay Sold Check', description: 'Check eBay sold listings for any product before listing it. See how many sold in 90 days, average sold price, and number of active competitors.' },
        { icon: '📦', title: 'Stock Verification', description: 'Verify Amazon stock levels, seller type (FBA, FBM, Amazon 1P), Prime status, and exact quantity available — all before you commit to listing.' },
        { icon: '🛡️', title: 'VERO Filter', description: 'Toggle VERO protection to automatically hide products from 3,390 restricted brands. Never accidentally list a product that gets your account suspended.' },
        { icon: '🚀', title: 'Transfer to Bulk Lister', description: 'Select your winners, click one button, and all products are transferred to the Bulk Lister queue ready for automated listing.' },
      ]}
      howItWorks={[
        'Open Product Hunter and enter a keyword like "dog accessories" or "kitchen gadgets". Set your price range (£10-£30 is the sweet spot for beginners).',
        'Results appear with Demand Score, reviews, rating, and price. Look for products scoring 70+ (Hot Demand) — these have proven buyer interest.',
        'Click "Check eBay Sales" to see real eBay data. Look for products with 20+ sold in 90 days and fewer than 500 competitors.',
        'Verify stock with one click to confirm the product is in stock on Amazon with reliable fulfilment (FBA or Amazon 1P preferred).',
        'Select your winning products and transfer them to the Bulk Lister. The entire research process takes minutes, not hours.',
      ]}
      ctaText="Start finding winning products"
    />
  );
}
