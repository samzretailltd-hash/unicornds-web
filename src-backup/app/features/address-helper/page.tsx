import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Address Helper & Order Fulfilment — Fulfil eBay Orders in 30 Seconds',
  description: 'Auto-capture shipping addresses from eBay orders. One-click auto-fill on AliExpress checkout. Smart order message templates.',
  keywords: ['ebay order fulfilment', 'ebay address auto fill', 'aliexpress address helper', 'ebay dropshipping fulfilment', 'order management ebay'],
};

export default function AddressHelperPage() {
  return (
    <FeaturePageLayout
      badge="FULFILMENT"
      badgeColor="bg-[#14B8A6]/15 text-[#14B8A6] border border-[#14B8A6]/20"
      title="Address Helper & Order Fulfilment"
      subtitle="Customer ordered? Buy from source and ship to them in 30 seconds."
      heroDescription="When a customer orders from your eBay store, you need to buy the product from your source (Amazon or AliExpress) and ship it directly to them. Manually copying names, addresses, postcodes, and phone numbers is slow and error-prone — one wrong digit means a lost package and an unhappy customer. Address Helper captures shipping addresses from eBay orders with one click and auto-fills them on AliExpress checkout. Combined with Smart Order Messages that send professional dispatch notifications to buyers, the entire fulfilment process takes under 30 seconds per order."
      screenshotAlt="UnicornDS Address Helper auto-filling shipping address on AliExpress checkout"
      sections={[
        { icon: '📋', title: 'One-Click Capture', description: 'On eBay order pages, click one button to capture the buyer shipping address. Name, street, city, postcode, country — all captured instantly.' },
        { icon: '✍️', title: 'Auto-Fill on AliExpress', description: 'Go to AliExpress checkout and the captured address fills in automatically. No typing, no copy-paste errors, no wrong postcodes.' },
        { icon: '💬', title: 'Smart Order Messages', description: 'Send professional dispatch messages to buyers with one click. Templates include buyer name, store name, and estimated delivery time.' },
        { icon: '🔗', title: 'SKU Link-Back', description: 'Every listing has a SKU linking back to the source product. Click the SKU on your order page to go directly to the Amazon or AliExpress product.' },
        { icon: '🌍', title: 'Multi-Platform', description: 'Captures addresses from eBay, Amazon, and TikTok orders. Fills on AliExpress, Amazon, or any checkout page.' },
        { icon: '⚡', title: '30-Second Fulfilment', description: 'Order in → address captured → source ordered → message sent. The entire process takes under 30 seconds per order.' },
      ]}
      howItWorks={[
        'A customer orders from your eBay store. You get a notification and see it in Seller Hub → Orders.',
        'On the order page, click the UnicornDS capture button. The buyer shipping address is saved.',
        'Click the SKU to open the source product (Amazon or AliExpress). Add to basket and go to checkout.',
        'The shipping address auto-fills on the checkout page. Verify it looks correct and place the order.',
        'Back on eBay, click the Smart Message button to send the buyer a professional dispatch notification.',
      ]}
      ctaText="Speed up your fulfilment"
    />
  );
}
