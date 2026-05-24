export const SITE = {
  name: "UnicornDS",
  domain: "unicornds.io",
  tagline: "eBay Dropshipping & Arbitrage Automation",
  email: "hello@unicornds.io",
  company: "UnicornDS",
  address: "",
  chrome_store: "/download",
};

export type PlanId = "starter" | "growth" | "empire";

export interface PlanFeature {
  text: string;
  status: "yes" | "no" | "ltd";
}

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number;
  annual: number;
  listings: string;
  popular?: boolean;
  features: PlanFeature[];
}

export const PLANS: Plan[] = [
  {
    id: "starter", name: "Starter", monthly: 29.99, annual: 287.88,
    listings: "500 listings/month",
    features: [
      { text: "500 eBay listings/month", status: "yes" },
      { text: "Product Hunter + Demand Score", status: "yes" },
      { text: "AI Cassini SEO Titles (GPT-4o)", status: "yes" },
      { text: "Bulk Lister (1 concurrent)", status: "yes" },
      { text: "VERO Protection (3,390 brands)", status: "yes" },
      { text: "All eBay research buttons", status: "yes" },
      { text: "Competitor Scanner (5/day)", status: "ltd" },
      { text: "Stock Checker (20/day)", status: "ltd" },
      { text: "🎓 UnicornDS Mastery Course", status: "no" },
      { text: "Email support", status: "yes" },
    ],
  },
  {
    id: "growth", name: "Growth", monthly: 59.99, annual: 575.88,
    listings: "1,500 listings/month", popular: true,
    features: [
      { text: "1,500 eBay listings/month", status: "yes" },
      { text: "Bulk Lister (5 concurrent)", status: "yes" },
      { text: "AI Cassini SEO Titles (GPT-4o)", status: "yes" },
      { text: "Product Hunter + Demand Score", status: "yes" },
      { text: "eBay Sold Check", status: "yes" },
      { text: "Competitor Scanner (unlimited)", status: "yes" },
      { text: "Stock Checker (unlimited)", status: "yes" },
      { text: "Image Designer", status: "yes" },
      { text: "VERO Protection (3,390 brands)", status: "yes" },
      { text: "Address Helper (auto-fill)", status: "yes" },
      { text: "🎓 UnicornDS Mastery Course (FREE)", status: "yes" },
      { text: "💬 Private Telegram Community", status: "yes" },
      { text: "Priority support", status: "yes" },
    ],
  },
  {
    id: "empire", name: "Empire", monthly: 99.99, annual: 959.88,
    listings: "3,000 listings/month",
    features: [
      { text: "3,000 eBay listings/month", status: "yes" },
      { text: "Bulk Lister (10 concurrent)", status: "yes" },
      { text: "Hunt speed (5 concurrent tabs)", status: "yes" },
      { text: "AI Cassini SEO Titles (GPT-4o)", status: "yes" },
      { text: "MSKU builder", status: "yes" },
      { text: "eBay Sold Check", status: "yes" },
      { text: "Competitor Scanner (unlimited)", status: "yes" },
      { text: "Stock Checker (unlimited)", status: "yes" },
      { text: "Image Designer", status: "yes" },
      { text: "VERO Protection (3,390 brands)", status: "yes" },
      { text: "Address Helper (auto-fill)", status: "yes" },
      { text: "🎓 UnicornDS Mastery Course (FREE)", status: "yes" },
      { text: "💬 VIP Telegram + 1-on-1 Call", status: "yes" },
      { text: "Dedicated support", status: "yes" },
    ],
  },
];
