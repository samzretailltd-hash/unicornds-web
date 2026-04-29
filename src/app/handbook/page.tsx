"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const sections = [
  {
    id: "getting-started",
    icon: "🚀",
    title: "Getting Started",
    items: [
      { title: "Create Your Account", content: "Go to unicornds.io/signup. Enter your full name, email, and password. Your 14-day free trial starts immediately with full access — AI titles, Product Hunter, and VERO protection." },
      { title: "Download & Install", content: "Log in at unicornds.io/download, click the download button, unzip the file, then go to chrome://extensions, enable Developer Mode, and click 'Load unpacked' to select the folder. Works on Chrome, Edge, Brave, and Opera." },
      { title: "Log In to the Extension", content: "Click the UnicornDS icon in your toolbar. Enter the same email and password you used on the website. You'll see the Listing tab with your plan details." },
      { title: "Forgot Password?", content: "Go to unicornds.io/login, enter your email, and click 'Forgot password?' below the login button. Check your inbox for a reset link from noreply@unicorn-ds-7f831.firebaseapp.com. Check spam if you don't see it within a minute." },
    ],
  },
  {
    id: "listing-aliexpress",
    icon: "🛒",
    title: "Listing from AliExpress",
    items: [
      { title: "Navigate to a Product", content: "Go to any AliExpress product page. The UnicornDS floating button appears showing the product title, price, and suggested eBay sell price with profit breakdown." },
      { title: "Scrape the Product", content: "Click 'Scrape This Product'. UnicornDS extracts the title, all images (filtering junk), variant options, price, stock status, and specifications." },
      { title: "List on eBay", content: "Click 'List on eBay'. The extension opens the eBay form and auto-fills: AI title (80 chars, SEO-optimised), up to 24 images, price with your profit margin, category, all item specifics via AI, and the description." },
      { title: "Variant (MSKU) Listings", content: "Products with multiple sizes/colours create Multi-SKU listings. Each variant gets its own price (with .99 rounding), photo, and SKU (e.g. UDS-AE-123456_V1)." },
    ],
  },
  {
    id: "listing-amazon",
    icon: "📦",
    title: "Listing from Amazon",
    items: [
      { title: "Navigate & List", content: "Go to any Amazon product page. The UnicornDS panel shows product details and pricing. Click 'List on eBay' — the process is identical to AliExpress." },
      { title: "Check on eBay", content: "Before listing, use 'Check on eBay' to search by EAN/UPC/MPN for exact matches. See how many competitors sell the same item and at what price." },
    ],
  },
  {
    id: "bulk-lister",
    icon: "⚡",
    title: "Bulk Listing",
    items: [
      { title: "Open Bulk Lister", content: "Go to Popup > Tools > Bulk Lister. Paste Amazon or AliExpress product URLs — one per line. You can mix sources." },
      { title: "Process & Monitor", content: "Click 'Start'. Each product is scraped, given an AI title, and listed on eBay. Growth plan runs 5 concurrent tabs; Empire runs 10. Don't close the Bulk Lister tab while processing." },
    ],
  },
  {
    id: "product-hunter",
    icon: "🎯",
    title: "Product Hunter",
    items: [
      { title: "Search by Keyword", content: "Enter a keyword (e.g. 'phone case') and select the Amazon marketplace (UK, US, DE, AU). Results show product name, price, reviews, Prime status, and BSR rank." },
      { title: "Filter & List", content: "Filter by price range, reviews, VERO status (auto-checked), and Prime eligibility. Click any product to open it, then use the normal listing flow." },
    ],
  },
  {
    id: "competitor-scanner",
    icon: "👥",
    title: "Competitor Scanner",
    items: [
      { title: "Scan a Seller", content: "Enter any eBay seller's username. Click 'Scan' to extract all their active listings with titles, prices, images, and sales data." },
      { title: "Use Their Products", content: "Find interesting products, search for the same item on Amazon or AliExpress to source it. Use 'Check on eBay' to verify demand." },
    ],
  },
  {
    id: "ai-titles",
    icon: "🤖",
    title: "AI Title Builder",
    items: [
      { title: "Generate Titles", content: "GPT-4o generates 3 SEO-optimised eBay titles from the product data. Each title is exactly 80 characters, keyword-rich, and free of banned words." },
      { title: "Choose & Edit", content: "Click a title to select it. Titles are generated automatically during listing — the standalone builder is for pre-planning." },
    ],
  },
  {
    id: "image-designer",
    icon: "🎨",
    title: "Image Designer",
    items: [
      { title: "Create Templates", content: "Design image templates with your store branding — logo, background, borders, and text overlays. Templates are saved and reused." },
      { title: "Watermarks & Badges", content: "Add 'FREE UK DELIVERY', '30-DAY RETURNS' badges, or your logo. Automatically applied to all product images during listing." },
    ],
  },
  {
    id: "tracker",
    icon: "📊",
    title: "Listing Tracker",
    items: [
      { title: "Track Listings", content: "Shows all active listings with views, watchers, and sales. Sort by watchers to find items with high buyer interest." },
      { title: "Send Offers", content: "'Send Offers to Watchers' sends discount offers to everyone watching your items. Set a discount % and it sends automatically." },
    ],
  },
  {
    id: "address-helper",
    icon: "📋",
    title: "Address Helper",
    items: [
      { title: "Copy from eBay", content: "Auto-captures buyer's shipping address from your eBay orders page (name, street, postcode, country, phone)." },
      { title: "Paste to AliExpress", content: "Click 'Paste to AliExpress' on AliExpress checkout — the address auto-fills. Includes duplicate detection to prevent double orders." },
    ],
  },
  {
    id: "orders",
    icon: "💬",
    title: "Orders & Smart Messages",
    items: [
      { title: "How It Works", content: "Per-order message buttons on eBay orders page. Auto-copies a delivery template with buyer name and store name. AliExpress: '3-4 days'. Amazon: '1-2 days'." },
    ],
  },
  {
    id: "stock",
    icon: "📦",
    title: "Stock Checker & Restock",
    items: [
      { title: "How It Works", content: "Inline buttons on your eBay Active Listings. 'Stock Check' fetches the source page to verify stock. 'Restock' updates quantity. Prevents cancelled orders — the #1 cause of eBay restrictions." },
    ],
  },
  {
    id: "pricing",
    icon: "💰",
    title: "Pricing & Settings",
    items: [
      { title: "Per-Source Settings", content: "Separate settings for AliExpress (default 50% profit) and Amazon (default 25% profit). Adjust in Settings tab." },
      { title: "Fee Calculation", content: "Accounts for eBay FVF (12.8% + £0.30 UK), Promoted Listings fee, VAT, and shipping cost. Calculates the sell price needed for your desired profit." },
      { title: ".99 Price Rounding", content: "Enable 'Round prices to .99' to make all prices end in .99 (e.g. £6.86 → £6.99). Supports .95 too." },
    ],
  },
  {
    id: "compliance",
    icon: "🛡️",
    title: "VERO & Compliance",
    items: [
      { title: "VERO Protection", content: "Auto-checks every product against 3,390+ VERO-protected brands. Red 'VERO BLOCKED' badge = do not list." },
      { title: "Knives & Weapons", content: "Blocks bladed items (knives, chisels, saws), weapons (crossbows, pepper spray), and items needing age-verified delivery. Smart exceptions for safe items like 'wiper blade' and 'silicone scraper'." },
      { title: "Product Safety", content: "Blocks baby sleep products, standalone 18650 batteries, laser pointers, and novelty lighters per eBay policy." },
    ],
  },
  {
    id: "plans",
    icon: "👑",
    title: "Plans & Billing",
    items: [
      { title: "Free Trial", content: "14 days, full access to your plan. Card captured, not charged during trial." },
      { title: "Starter — £23.99/mo", content: "500 listings/month, Product Hunter, AI titles, 5 competitor scans/day." },
      { title: "Growth — £47.99/mo", content: "1,500 listings, 5 bulk tabs, unlimited scanner, Image Designer, Address Helper." },
      { title: "Empire — £79.99/mo", content: "3,000 listings, 10 bulk tabs, MSKU builder, priority support. Works across multiple eBay accounts." },
    ],
  },
];

const faqs = [
  { q: "Extension shows 'Navigate to an AliExpress product page'", a: "Make sure you're on an actual product page (URL contains /item/). Search results don't trigger the scraper." },
  { q: "Listing form fields are empty after filling", a: "eBay sometimes reloads the page after saving specs. v7.11.2 includes auto-retry for empty required fields." },
  { q: "Variant prices don't end in .99", a: "Enable 'Round prices to .99' in Settings tab and save." },
  { q: "Bulk Lister stops mid-way", a: "Don't close the Bulk Lister tab. Keep Chrome active. v7.11.2 includes crash recovery." },
  { q: "Password reset email not arriving", a: "Check spam folder. Email comes from noreply@unicorn-ds-7f831.firebaseapp.com." },
  { q: "How do I update the extension?", a: "A gold badge and purple banner appear in the popup when an update is available. Click to download from unicornds.io/download." },
];

export default function HandbookPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-[#a5a0cc]">Loading...</p></div>;

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <span className="text-5xl mb-4 block">🔒</span>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-3">Members Only</h1>
          <p className="text-[#a5a0cc] mb-6">The UnicornDS Handbook is available to registered members. Log in or create a free account to access it.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">Log In</Link>
            <Link href="/signup" className="px-6 py-3 rounded-xl text-sm font-semibold border border-[#3d3580] text-[#e0d8ff] hover:border-[#7C3AED] hover:text-white transition-all">Sign Up Free</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider mb-4">
            Members Only
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-3">
            UnicornDS Handbook
          </h1>
          <p className="text-[#a5a0cc] max-w-xl mx-auto mb-6">
            The complete guide to every feature in UnicornDS — from signup to scaling your eBay business.
          </p>
          <a
            href="/UnicornDS_Handbook_v7.11.2.pdf"
            download
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl text-sm font-bold"
          >
            <span>📄</span> Download PDF Handbook (v7.11.2)
          </a>
        </div>

        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full p-5 flex items-center gap-3 text-left hover:bg-[#1E1B4B]/80 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{section.icon}</span>
                <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-white flex-1">{section.title}</h2>
                <span className={`text-[#F59E0B] text-xl transition-transform ${activeSection === section.id ? "rotate-45" : ""}`}>+</span>
              </button>
              {activeSection === section.id && (
                <div className="px-5 pb-5 space-y-4 border-t border-[#3d3580]/50">
                  {section.items.map((item, i) => (
                    <div key={i} className="pt-4">
                      <h3 className="text-sm font-bold text-[#A78BFA] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#a5a0cc] leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-6 text-center">Troubleshooting & FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl group">
                <summary className="p-4 cursor-pointer font-semibold text-white text-sm flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-[#F59E0B] text-xl transition-transform group-open:rotate-45 ml-3 flex-shrink-0">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#a5a0cc]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#6b6899]">
            Need more help? <Link href="/support" className="text-[#A78BFA] hover:underline">Contact support</Link> or email <a href="mailto:support@unicornds.io" className="text-[#A78BFA] hover:underline">support@unicornds.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
