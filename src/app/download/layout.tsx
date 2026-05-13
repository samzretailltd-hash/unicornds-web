import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download UnicornDS — Free Chrome Extension for eBay Sellers",
  description: "Install UnicornDS Chrome extension free. Start eBay dropshipping with Amazon & AliExpress in minutes. 7-day trial for just £1 on every plan. £1 trial activation fee..",
  keywords: ["download UnicornDS", "eBay dropshipping extension", "install UnicornDS", "Chrome extension eBay", "free eBay tool"],
  alternates: { canonical: "https://www.unicornds.io/download" },
  openGraph: {
    title: "Download UnicornDS — Free Chrome Extension",
    description: "Install in under 2 minutes. 7-day trial for just £1, card verified.",
    url: "https://www.unicornds.io/download",
    type: "website",
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
