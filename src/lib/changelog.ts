   // ════════════════════════════════════════════════════════
// UnicornDS Changelog — Single Source of Truth
// ════════════════════════════════════════════════════════
// To add a new entry: just add a new object at the TOP of the array.
// All pages (public /changelog, dashboard widget, RSS feed) update automatically.
//
// Categories:
//   - 'feature'      🚀 New Feature
//   - 'fix'          🐛 Bug Fix
//   - 'improvement'  ⚡ Improvement
//   - 'launch'       🎉 Major Launch
//   - 'security'     🔒 Security
// ════════════════════════════════════════════════════════

export type ChangelogCategory = 'feature' | 'fix' | 'improvement' | 'launch' | 'security';

export interface ChangelogEntry {
  date: string;          // YYYY-MM-DD
  version?: string;      // optional, e.g. "v7.20.0"
  category: ChangelogCategory;
  title: string;         // short headline
  description: string;   // 1-2 sentences max
  area: 'extension' | 'website' | 'backend' | 'course';
}

export const CHANGELOG: ChangelogEntry[] = [
  // ═══════════════════ JUNE 2026 ═══════════════════
  {
    date: '2026-06-21',
    version: 'v7.23.7',
    category: 'fix',
    title: 'EU markets: variations, pricing & descriptions fixed',
    description: 'Listing to eBay France, Germany, Spain and Italy now works end-to-end. Multi-variation listings create your own variation attribute and add every supplier option; EU prices use the correct comma decimal (12,99 €) so they are no longer read as inflated; item specifics are no longer duplicated on non-UK markets; and the AI description no longer leaks raw code or line-break characters into the listing.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.23.0',
    category: 'feature',
    title: 'eBay UK restricted-words protection',
    description: 'Built-in eBay UK block-words list (updated 31 May 2026, 1,197 terms) flags high-risk words before you list — perfume, batteries, baby items, supplements, tools and more — so you can edit or skip and avoid blocked or removed listings. Protective and General levels, plus optional hard-block.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v18',
    category: 'feature',
    title: 'Live chat support + Telegram community',
    description: 'Added Tawk.to live chat across the site and a Telegram community with a join button and scannable QR code on the download page and footer.',
    area: 'website',
  },
  {
    date: '2026-06-21',
    version: 'v7.22.0',
    category: 'feature',
    title: 'Smarter, higher-converting eBay descriptions',
    description: 'AI descriptions now build a benefit strip, spec table, compatibility table, a "Why buy from us" comparison and a buyer FAQ — structured, mobile-first, and proven to lift conversion.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.22.0',
    category: 'feature',
    title: 'Localized trust & support per marketplace',
    description: 'Every listing ends with a branded delivery, returns and support row in the buyer\'s own language and region — UK, US, Deutschland, France, Italia, España and more.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.22.0',
    category: 'security',
    title: 'Built-in eBay compliance guard',
    description: 'A sanitizer strips any banned active content (JavaScript, forms, iframes, event handlers) before a description is posted, so listings can\'t be hidden for policy violations.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.21.0',
    category: 'feature',
    title: 'Walmart product variations now import',
    description: 'Size, colour and style options import automatically, each with its own price and image — full multi-variant eBay listings instead of a single variant.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.21.0',
    category: 'feature',
    title: 'Walmart strict sourcing — Walmart-fulfilled only',
    description: 'Only list products sold AND shipped by Walmart.com. Unreliable third-party marketplace sellers (including WFS) are detected and skipped, so your stock and prices stay dependable.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.21.0',
    category: 'feature',
    title: 'Multi-currency support (€, $, CHF, C$)',
    description: 'Correct currency symbols and decimals across markets. Fixes European comma prices like €1,43 that were being read as 143.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.21.0',
    category: 'feature',
    title: 'Native-language listings per marketplace',
    description: 'Titles and descriptions are written in the marketplace language automatically — German for .de, French for .fr, and so on — based on the eBay market you sell on.',
    area: 'extension',
  },
  {
    date: '2026-06-21',
    version: 'v7.21.0',
    category: 'fix',
    title: 'Order Manager — delivered status, full imports, accurate earnings',
    description: 'Delivered orders no longer get stuck on "pending", syncs now import all orders reliably (progressive save), and exact earnings are captured for more orders with amounts over £1,000 read correctly.',
    area: 'extension',
  },
  {
    date: '2026-06-05',
    version: 'v17',
    category: 'launch',
    title: 'Walmart added as a 3rd supplier + US & Canada markets',
    description: 'Source from Amazon, AliExpress AND Walmart — now selling into eBay US and Canada. Plus a new animated homepage and 10 new guides.',
    area: 'website',
  },
  // ═══════════════════ MAY 2026 ═══════════════════
  {
    date: '2026-05-24',
    version: 'v12',
    category: 'feature',
    title: 'Live changelog page launched',
    description: 'Track every bug fix, feature, and improvement in real time. Now available at /changelog with RSS feed and dashboard widget.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v12',
    category: 'improvement',
    title: 'Download page updated to extension v7.20.0',
    description: 'Customer downloads now serve the latest extension with Order Manager, Bulk Fulfill, and Amazon address auto-fill.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v11',
    category: 'feature',
    title: 'Order Manager, Bulk Fulfill, and Repeat Buyer detection added to homepage',
    description: 'New feature cards on the homepage showcase the most powerful Order Manager capabilities. All 4 languages updated (EN, DE, FR, ES).',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v10',
    category: 'fix',
    title: 'Fixed duplicate "| UnicornDS" appearing in page titles',
    description: 'Calculator, glossary, and other pages were showing the brand name twice in browser tabs and Google search results. Fixed across 6 pages.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v10',
    category: 'improvement',
    title: 'Added page-specific Open Graph images',
    description: 'Profit margin calculator, glossary, and eBay fees calculator now have proper social sharing previews on Twitter, Facebook, and LinkedIn.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v7.20.0',
    category: 'feature',
    title: 'Bulk Fulfill — process 50 orders at once',
    description: 'Select multiple orders with checkboxes, click one button to open all supplier tabs. Process 50 orders in 10 minutes instead of 3 hours.',
    area: 'extension',
  },
  {
    date: '2026-05-24',
    version: 'v7.20.0',
    category: 'feature',
    title: 'Repeat Buyer Detection with VIP badges',
    description: 'Auto-detects returning customers. 2nd order shows a repeat badge, 3rd+ shows a gold VIP star. Build loyalty and spot your best buyers instantly.',
    area: 'extension',
  },
  {
    date: '2026-05-24',
    version: 'v7.20.0',
    category: 'feature',
    title: 'Amazon address auto-fill (11 countries)',
    description: 'Floating Paste button on Amazon checkout pages (UK, US, DE, FR, ES, IT, CA, AU, NL, PL, IE). One click fills name, phone, country, address, city, zip.',
    area: 'extension',
  },
  {
    date: '2026-05-24',
    version: 'v7.20.0',
    category: 'feature',
    title: 'Item thumbnails in Order Manager',
    description: 'See product images next to each order. Quickly identify items at a glance without clicking through to eBay.',
    area: 'extension',
  },
  {
    date: '2026-05-24',
    version: 'v7.20.0',
    category: 'feature',
    title: 'Pending order count badge on extension popup',
    description: 'Live counter on the "Order Manager" button. Turns red when any order is 3+ days late so you never miss a fulfillment deadline.',
    area: 'extension',
  },
  {
    date: '2026-05-24',
    version: 'v9',
    category: 'launch',
    title: 'Bilingual Mastery Course — English + Urdu',
    description: 'Customer course dashboard now supports both English and Roman Urdu. Toggle between languages, your preference is saved. Module 1 scripts complete.',
    area: 'course',
  },
  {
    date: '2026-05-24',
    version: 'v8',
    category: 'feature',
    title: 'Free Profit Margin Calculator launched',
    description: 'Calculate net profit, gross margin, markup, and ROI for eBay dropshipping. 4 preset modes (Amazon Arbitrage, AliExpress, Wholesale, Used).',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v8',
    category: 'feature',
    title: '60+ term dropshipping glossary',
    description: 'Free glossary explaining VERO, FBA, Cassini, MSKU, FVF, VAT, and 55+ more terms. Search and filter by category.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v8',
    category: 'feature',
    title: 'vs EcomSniper comparison page',
    description: 'Detailed 29-row comparison showing where UnicornDS wins on price, features, and UK-specific support.',
    area: 'website',
  },
  {
    date: '2026-05-24',
    version: 'v5',
    category: 'feature',
    title: 'Free eBay Fees Calculator launched',
    description: '12 UK categories, 6 marketplaces, all 2026 fee rates (FVF, per-order, regulatory, VAT, promoted listings, seller level discounts).',
    area: 'website',
  },
  {
    date: '2026-05-23',
    version: 'v7.19.1',
    category: 'fix',
    title: 'SKU field now updates correctly when bulk listing',
    description: 'Fixed a React state issue where the SKU field would visually update but eBay would still receive the old value on submit.',
    area: 'extension',
  },
  {
    date: '2026-05-23',
    version: 'v7.19.0',
    category: 'improvement',
    title: 'Order sync now fetches up to 1,600 orders per pull',
    description: '8 pages × 200 orders per page. Live progress counter shows pages fetched. 10-minute timeout safety.',
    area: 'extension',
  },
  {
    date: '2026-05-23',
    version: 'v7.18.3',
    category: 'fix',
    title: 'CRITICAL — Order Manager no longer shows empty after sync',
    description: 'A race condition between sync and the page-load orphan recovery was wiping orders. Reworked merge logic into a reusable function. Affected ~5% of syncs.',
    area: 'extension',
  },
  {
    date: '2026-05-23',
    version: 'v7.18.0',
    category: 'feature',
    title: '12 buyer message templates with smart variables',
    description: 'Send the right message at the right time with pre-built templates. 8 smart variables auto-fill buyer name, tracking number, item title, and more.',
    area: 'extension',
  },
  {
    date: '2026-05-22',
    version: 'v7.17.0',
    category: 'feature',
    title: 'Combined tracking + supplier ID modal',
    description: 'Add tracking number, carrier, supplier order ID, and cost in one modal. Auto-detect supplier type from SKU. Saves clicks per order.',
    area: 'extension',
  },
  {
    date: '2026-05-21',
    version: 'v7.14.0',
    category: 'launch',
    title: 'Order Manager dashboard launched',
    description: 'Track every eBay order with profit per sale, margin, age, status, and CSV export. Loss alerts and late shipment warnings built in.',
    area: 'extension',
  },
  {
    date: '2026-05-20',
    category: 'fix',
    title: 'Fixed £1 trial charge bug',
    description: 'Some trial users were charged £1 but received 0 tokens. Webhook now correctly handles failed payments and sync-stripe verifies actual invoice status.',
    area: 'backend',
  },
  {
    date: '2026-05-19',
    category: 'security',
    title: 'Firebase upgraded to Node 22',
    description: 'Backend now runs on Node.js 22 with firebase-functions 6.4.0. Stays supported through October 2026 with latest security patches.',
    area: 'backend',
  },
];

// Helpers
export function getRecentChangelog(limit: number = 5): ChangelogEntry[] {
  return CHANGELOG.slice(0, limit);
}

export function getCategoryStyle(cat: ChangelogCategory): { emoji: string; label: string; color: string; bg: string } {
  switch (cat) {
    case 'feature':     return { emoji: '🚀', label: 'New Feature',  color: '#A78BFA', bg: 'rgba(124,58,237,0.15)' };
    case 'fix':         return { emoji: '🐛', label: 'Bug Fix',      color: '#34D399', bg: 'rgba(16,185,129,0.15)' };
    case 'improvement': return { emoji: '⚡', label: 'Improvement',  color: '#FBBF24', bg: 'rgba(245,158,11,0.15)' };
    case 'launch':      return { emoji: '🎉', label: 'Launch',       color: '#F472B6', bg: 'rgba(236,72,153,0.15)' };
    case 'security':    return { emoji: '🔒', label: 'Security',     color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' };
  }
}

export function getAreaStyle(area: ChangelogEntry['area']): { label: string; color: string } {
  switch (area) {
    case 'extension': return { label: 'Extension', color: '#A78BFA' };
    case 'website':   return { label: 'Website',   color: '#34D399' };
    case 'backend':   return { label: 'Backend',   color: '#60A5FA' };
    case 'course':    return { label: 'Course',    color: '#FBBF24' };
  }
}
