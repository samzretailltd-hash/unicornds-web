import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free eBay Fees Calculator 2026 — UK & US Profit Calculator | UnicornDS",
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
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
