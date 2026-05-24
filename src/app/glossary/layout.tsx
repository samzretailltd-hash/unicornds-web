import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eBay Dropshipping Glossary — 60+ Terms Explained | UnicornDS",
  description: "Complete glossary of eBay, Amazon, AliExpress, shipping & tax terms for dropshippers. VERO, FBA, Cassini, MSKU, FVF, VAT — all explained simply.",
  keywords: ["ebay dropshipping glossary", "ebay terms", "amazon arbitrage terms", "VERO meaning", "cassini ebay", "MSKU", "FBA FBM"],
  alternates: { canonical: "https://www.unicornds.io/glossary" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
