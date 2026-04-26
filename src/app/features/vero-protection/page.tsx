import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'VERO Protection — Protect Your eBay Account from Suspension',
  description: '3,390 VERO-protected brands checked automatically. Smart accessory detection lets you sell cases "for iPhone" while blocking counterfeits.',
  keywords: ['ebay vero protection', 'vero checker ebay', 'ebay account suspension protection', 'ebay vero brand list', 'ebay restricted brands checker'],
};

export default function VeroProtectionPage() {
  return (
    <FeaturePageLayout
      badge="ACCOUNT SAFETY"
      badgeColor="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20"
      title="VERO Protection"
      subtitle="3,390 restricted brands checked automatically. One strike can end your business."
      heroDescription="VERO (Verified Rights Owner Programme) is eBay's intellectual property protection system. Brands like Nike, Apple, Sony, and thousands of others can report your listing and eBay removes it instantly. Three VERO strikes and your account is suspended — your listings, feedback score, and sales history gone overnight. UnicornDS checks every product against a database of 3,390 VERO-protected brands before you list. It also includes smart accessory detection: a 'case for iPhone' is an accessory (allowed), not a counterfeit iPhone (blocked). Beyond VERO, the compliance checker also catches bladed items, weapons, and product safety violations."
      screenshotAlt="UnicornDS VERO Protection showing brand check results and safety status"
      sections={[
        { icon: '🛡️', title: '3,390 VERO Brands', description: 'The most comprehensive VERO brand database available. Updated regularly with new brands as they join the programme.' },
        { icon: '🧠', title: 'Smart Accessory Detection', description: 'Knows the difference between selling a counterfeit Nike shoe (blocked) and a replacement lace "for Nike Air Max" (allowed). Context-aware matching.' },
        { icon: '🔪', title: 'Compliance Checker', description: 'Beyond VERO: checks for bladed items, weapons, banned products, and CE/UKCA marking requirements. Uses word-boundary matching to avoid false positives.' },
        { icon: '⚡', title: 'Pre-Listing Check', description: 'Every product is checked BEFORE the listing form opens. Blocked items never reach eBay — saving you from strikes you would not see coming.' },
        { icon: '🎯', title: 'Product Hunter Integration', description: 'VERO filter in Product Hunter hides restricted products from search results. You never even see products that would get you in trouble.' },
        { icon: '📋', title: 'Detailed Reasons', description: 'When a product is blocked, you see exactly why: which brand triggered it, the specific VERO policy link, and whether it is a full block or a warning.' },
      ]}
      howItWorks={[
        'Every time you list a product — single or bulk — the title, brand, and description are checked against the VERO database.',
        'If a VERO brand is detected, the extension checks context: is it the actual brand product or just an accessory/compatible item?',
        'Keywords like "compatible with", "for", "fits" signal accessories — these pass the check. Direct brand products are blocked.',
        'Compliance checks also run: bladed items, weapons, product safety regulations. These use word-boundary matching to avoid false positives.',
        'Blocked items show a clear message explaining why. You can skip them and move on — your account stays safe.',
      ]}
      ctaText="Protect your eBay account"
    />
  );
}
