export const SITE = {
  name: "UnicornDS",
  domain: "unicornds.io",
  tagline: "eBay Dropshipping & Arbitrage Automation",
  email: "hello@unicornds.io",
  company: "UnicornDS",
  address: "",
  chrome_store: "/download",
};

export const PAYMENT_LINKS = {
  starter_monthly: "https://checkout.revolut.com/pay/16f2e850-7c62-401c-b3ca-6e04393c4662",
  starter_annual: "https://checkout.revolut.com/pay/71cbbe09-f034-4d30-8e79-cd63cb4a38f1",
  growth_monthly: "https://checkout.revolut.com/pay/844d5b5b-1a88-4b26-8905-e2a31818d9b5",
  growth_annual: "https://checkout.revolut.com/pay/23f8c251-f608-49aa-be38-554027c34c0e",
  empire_monthly: "https://checkout.revolut.com/pay/9fd277e9-b27f-4861-b119-59ac406d6a12",
  empire_annual: "https://checkout.revolut.com/pay/132e796b-84d7-4e5e-b2ca-8efa22e5fabc",
} as const;

export type PlanId = "free" | "starter" | "growth" | "empire";

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
    id: "free", name: "14-Day Trial", monthly: 0, annual: 0,
    listings: "100 listings in 14 days",
    features: [
      { text: "Full Starter features for 14 days", status: "yes" },
      { text: "Product Hunter (unlimited)", status: "yes" },
      { text: "AI Title Builder (GPT-4o)", status: "yes" },
      { text: "Competitor Scanner (3/day)", status: "ltd" },
      { text: "Stock Checker (10/day)", status: "ltd" },
      { text: "Bulk Lister (1 tab)", status: "ltd" },
      { text: "VERO Protection", status: "yes" },
      { text: "Image Designer", status: "no" },
      { text: "Address Helper", status: "no" },
    ],
  },
  {
    id: "starter", name: "Starter", monthly: 29.99, annual: 287.88,
    listings: "500 listings/month",
    features: [
      { text: "Everything in Free, plus:", status: "yes" },
      { text: "Product Hunter (unlimited)", status: "yes" },
      { text: "All eBay research buttons", status: "yes" },
      { text: "Extract titles + CSV export", status: "yes" },
      { text: "Competitor Scanner (5/day)", status: "ltd" },
      { text: "Stock Checker (20/day)", status: "ltd" },
      { text: "Bulk Lister (1 tab)", status: "ltd" },
      { text: "AI Title Builder (GPT-4o)", status: "yes" },
      { text: "Address Helper", status: "no" },
    ],
  },
  {
    id: "growth", name: "Growth", monthly: 59.99, annual: 575.88,
    listings: "1,500 listings/month", popular: true,
    features: [
      { text: "Everything in Starter, plus:", status: "yes" },
      { text: "Bulk Lister (5 concurrent)", status: "yes" },
      { text: "AI titles (GPT-4o)", status: "yes" },
      { text: "Competitor Scanner (unlimited)", status: "yes" },
      { text: "Stock Checker (unlimited)", status: "yes" },
      { text: "Image Designer", status: "yes" },
      { text: "Tracker + Send Offers", status: "yes" },
      { text: "VERO protection", status: "yes" },
      { text: "Address Helper (auto-fill)", status: "yes" },
    ],
  },
  {
    id: "empire", name: "Empire", monthly: 99.99, annual: 959.88,
    listings: "3,000 listings/month",
    features: [
      { text: "Everything in Growth, plus:", status: "yes" },
      { text: "Bulk Lister (10 concurrent)", status: "yes" },
      { text: "Hunt speed (5 concurrent tabs)", status: "yes" },
      { text: "MSKU builder", status: "yes" },
      { text: "Purchase history checker", status: "yes" },
      { text: "Auto-order pipeline", status: "yes" },
      { text: "Priority AI + support", status: "yes" },
    ],
  },
];
