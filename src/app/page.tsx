import { HomeContent } from "@/components/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UnicornDS — eBay Dropshipping & Amazon Arbitrage Automation Tool",
  description: "The #1 Chrome extension for eBay sellers worldwide. Find profitable products on Amazon & AliExpress, list them on eBay in seconds with AI titles, bulk listing, competitor scanning, and stock checking.",
};

export default function Home() {
  return <HomeContent />;
}
