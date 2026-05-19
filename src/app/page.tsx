import { HomeContent } from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "eBay Dropshipping Chrome Extension — Amazon to eBay Arbitrage Tool | UnicornDS",
  description:
    "The #1 Chrome extension for eBay sellers. Source from Amazon & AliExpress, list on eBay in seconds with AI titles, VERO protection & bulk listing. 7-day trial from £1.",
  alternates: { canonical: "https://www.unicornds.io" },
};

export default function Home() {
  return <HomeContent />;
}
