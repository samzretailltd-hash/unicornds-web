import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UnicornDS Affiliate Program — Earn Recurring Commission",
  description: "Join the UnicornDS affiliate program. Earn recurring commission on every subscription you refer. Monthly payouts via PayPal or bank transfer.",
  keywords: ["UnicornDS affiliate", "eBay tool affiliate", "dropshipping affiliate program", "SaaS affiliate"],
  alternates: { canonical: "https://www.unicornds.io/affiliate" },
  openGraph: {
    title: "UnicornDS Affiliate Program",
    description: "Promote the #1 eBay dropshipping tool. Earn every month.",
    url: "https://www.unicornds.io/affiliate",
    type: "website",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
