import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free eBay Dropshipping Guide 2026 — 20-Chapter PDF | UnicornDS",
  description: "Download the free 2026 eBay dropshipping starter guide. 20 chapters on finding products, VERO, titles, pricing, scaling. Written by active eBay sellers.",
  keywords: ["eBay dropshipping guide", "free eBay guide", "eBay dropshipping PDF", "how to start eBay dropshipping"],
  alternates: { canonical: "https://www.unicornds.io/free-guide" },
  openGraph: {
    title: "Free eBay Dropshipping Starter Kit 2026",
    description: "20 chapters. Everything you need to start. Free PDF download.",
    url: "https://www.unicornds.io/free-guide",
    type: "website",
  },
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
