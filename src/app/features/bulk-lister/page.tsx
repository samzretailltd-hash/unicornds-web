import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Bulk Lister — List Hundreds of Products on eBay Automatically',
  description: 'Automated eBay listing tool. AI titles, descriptions, images, item specifics — everything filled automatically. List 50+ products while you sleep.',
  keywords: ['ebay bulk lister', 'automated ebay listing', 'bulk list ebay', 'ebay listing automation tool', 'mass list ebay products'],
};

export default function BulkListerPage() {
  return (
    <FeaturePageLayout
      badge="AUTOMATION"
      badgeColor="bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/20"
      title="Bulk Lister"
      subtitle="List hundreds of products on eBay automatically. AI handles everything."
      heroDescription="The Bulk Lister is UnicornDS's most powerful feature. Paste Amazon or AliExpress URLs, click start, and watch it list products one after another — completely hands-free. For each product, it scrapes all data from the source, generates a Cassini-optimised title using GPT-4o, writes a mobile-friendly description with trust signals, uploads up to 8 high-resolution images, fills every item specific, sets the price with your desired profit margin, and submits the listing. When one product finishes, it immediately moves to the next. You can list 50 products in 30 minutes while doing something else."
      screenshotAlt="UnicornDS Bulk Lister showing automated queue with products being listed on eBay"
      sections={[
        { icon: '🤖', title: 'Fully Automated', description: 'From scraping to submitting — zero manual work. The extension fills every field on eBay, handles fee confirmations, and moves to the next product automatically.' },
        { icon: '🧠', title: 'AI-Powered Content', description: 'GPT-4o generates Cassini-optimised titles, SEO descriptions with trust signals, and fills item specifics using product data and images.' },
        { icon: '📸', title: 'Auto Image Upload', description: 'Up to 8 high-resolution product images scraped from the source and uploaded directly to eBay. No manual downloading needed.' },
        { icon: '💰', title: 'Smart Pricing', description: 'Set your desired profit margin (e.g. 30%). The extension calculates sell price accounting for eBay fees, promo fees, and rounds to £X.99.' },
        { icon: '🔄', title: 'Auto-Recovery', description: 'If a listing gets stuck, the extension detects it and moves on automatically. CAPTCHA detection pauses the queue and alerts you.' },
        { icon: '📊', title: 'Real-Time Queue', description: 'Watch progress in real-time: success count, failure count, speed per hour. Activity log shows every action taken.' },
      ]}
      howItWorks={[
        'Add products by pasting Amazon or AliExpress URLs (up to 100 at once), or transfer from Product Hunter.',
        'Set your preferences: profit margin, quantity, shipping policy, target eBay market (UK, US, DE, etc.).',
        'Click "Start Listing". The extension processes each product: scrape → AI title → AI description → upload images → fill specs → submit.',
        'Watch the queue update in real-time. Each product takes about 90 seconds. 50 products = roughly 30 minutes.',
        'Done! Check your eBay Seller Hub — all listings are live with professional titles, descriptions, and images.',
      ]}
      ctaText="Start bulk listing today"
    />
  );
}
