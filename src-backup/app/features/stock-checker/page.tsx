import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Stock Checker & Restock — Never Sell Out-of-Stock Items on eBay',
  description: 'Verify Amazon stock levels, seller type, Prime status before listing. Inline restock buttons on eBay active listings page.',
  keywords: ['ebay stock checker', 'ebay inventory monitoring', 'amazon stock check', 'ebay restock tool', 'out of stock ebay'],
};

export default function StockCheckerPage() {
  return (
    <FeaturePageLayout
      badge="MONITORING"
      badgeColor="bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/20"
      title="Stock Checker & Restock"
      subtitle="Selling an out-of-stock item gets you a defect. This prevents that."
      heroDescription="An eBay defect from selling an out-of-stock item hurts your account more than 10 successful sales help it. Stock Checker verifies Amazon stock levels before you list and provides inline monitoring buttons on your eBay Active Listings page. For each product, you can see the exact quantity available, the seller type (Amazon 1P, FBA, FBM), Prime eligibility, and current price. If stock runs low or goes out of stock, you know immediately — before a buyer orders and you cannot fulfil."
      screenshotAlt="UnicornDS Stock Checker showing stock levels and seller information"
      sections={[
        { icon: '📦', title: 'Pre-Listing Verification', description: 'Verify stock before listing — see exact quantity, seller type, and Prime status. Available in Product Hunter and one-click listing.' },
        { icon: '🏪', title: 'Seller Type Detection', description: 'Know who is selling: Amazon 1P (most reliable), FBA (good), FBM+Prime (acceptable), FBM (risky for delivery times).' },
        { icon: '📊', title: 'Active Listings Monitor', description: 'Inline Stock Check buttons appear on your eBay Active Listings page. Check any product with one click.' },
        { icon: '🔄', title: 'Restock Button', description: 'When stock changes, click Restock to update the quantity on your eBay listing instantly.' },
        { icon: '⚡', title: 'Prime Status', description: 'See Prime eligibility at a glance. Prime products have faster, more reliable delivery — better for your buyer satisfaction.' },
        { icon: '💰', title: 'Price Monitoring', description: 'Source prices change. If Amazon raises the price, your profit margin shrinks. Stock Check shows the current price so you can adjust.' },
      ]}
      howItWorks={[
        'In Product Hunter, click "Verify All Stock" to check every product before listing. Results show quantity, seller type, and Prime status.',
        'Products with low stock (under 5) are flagged in red. Out-of-stock products are marked clearly.',
        'On your eBay Active Listings page, UnicornDS adds inline buttons. Click "Stock Check" on any listing.',
        'The extension opens the source product page in a background tab, checks stock, and shows the result — without leaving your eBay page.',
        'If stock is low, click "Restock" to update the quantity. If out of stock, end the listing before a buyer orders.',
      ]}
      ctaText="Keep your inventory in check"
    />
  );
}
