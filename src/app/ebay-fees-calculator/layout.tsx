import type { Metadata } from "next";

export const metadata: Metadata = {
  // Template "%s | UnicornDS" from root layout will append the brand
  title: "Free eBay Fees Calculator 2026 — UK & US Profit Calculator",
  description: "Calculate your real eBay profit in seconds. Free 2026 calculator with Final Value Fees, per-order fees, VAT, promoted listings & seller level discounts. UK & US sellers.",
  keywords: ["ebay fees calculator", "ebay fee calculator uk", "ebay seller fees 2026", "ebay profit calculator", "ebay final value fee", "ebay calculator", "dropshipping calculator", "ebay margin calculator"],
  alternates: {
    canonical: "https://www.unicornds.io/ebay-fees-calculator",
  },
  openGraph: {
    title: "Free eBay Fees Calculator 2026 — Calculate Profit Instantly",
    description: "Free eBay fees calculator for UK & US sellers. All categories, VAT, promoted listings, seller levels. Updated for 2026.",
    url: "https://www.unicornds.io/ebay-fees-calculator",
    type: "website",
    images: [
      {
        url: "https://www.unicornds.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free eBay Fees Calculator 2026 — UnicornDS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free eBay Fees Calculator 2026",
    description: "Calculate Final Value Fees, VAT, profit & margin for UK & US sellers. Free.",
    images: ["https://www.unicornds.io/og-image.png"],
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
