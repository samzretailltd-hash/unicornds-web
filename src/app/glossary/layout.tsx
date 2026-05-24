import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eBay Dropshipping Glossary — 60+ Terms Explained",
  description: "Complete glossary of eBay, Amazon, AliExpress, shipping & tax terms for dropshippers. VERO, FBA, Cassini, MSKU, FVF, VAT — all explained simply.",
  keywords: ["ebay dropshipping glossary", "ebay terms", "amazon arbitrage terms", "VERO meaning", "cassini ebay", "MSKU", "FBA FBM"],
  alternates: { canonical: "https://www.unicornds.io/glossary" },
  openGraph: {
    title: "eBay Dropshipping Glossary — 60+ Terms Explained",
    description: "VERO, FBA, Cassini, MSKU, FVF, VAT — every eBay and dropshipping term, in plain English.",
    url: "https://www.unicornds.io/glossary",
    type: "website",
    images: [
      {
        url: "https://www.unicornds.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "eBay Dropshipping Glossary — UnicornDS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "eBay Dropshipping Glossary — 60+ Terms",
    description: "VERO, FBA, Cassini, MSKU, FVF — every eBay term, in plain English.",
    images: ["https://www.unicornds.io/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
