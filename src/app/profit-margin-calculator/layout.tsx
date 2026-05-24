import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Profit Margin Calculator for eBay Dropshipping 2026",
  description: "Calculate net profit margin, gross margin, markup & ROI for eBay dropshipping, Amazon arbitrage, and AliExpress. Free, no signup, instant results.",
  keywords: ["profit margin calculator", "ebay profit calculator", "dropshipping profit", "amazon arbitrage calculator", "margin calculator"],
  alternates: { canonical: "https://www.unicornds.io/profit-margin-calculator" },
  openGraph: {
    title: "Free Profit Margin Calculator for eBay Dropshipping 2026",
    description: "Calculate net & gross margin, markup, ROI for eBay dropshipping, Amazon arbitrage & AliExpress. Free.",
    url: "https://www.unicornds.io/profit-margin-calculator",
    type: "website",
    images: [
      {
        url: "https://www.unicornds.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Profit Margin Calculator — UnicornDS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Profit Margin Calculator 2026",
    description: "Net margin, gross margin, markup, ROI — instantly. Free.",
    images: ["https://www.unicornds.io/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
