import Stripe from "stripe";

let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    if (!_stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
      _stripe = new Stripe(key, {});
    }
    return (_stripe as any)[prop];
  },
});

// Price ID → tier mapping
export const PRICE_TO_TIER: Record<string, { tier: string; period: string; tokensTotal: number }> = {
  // Starter
  "price_1TPV6dEbEc6ySyqKFjBA3MhJ": { tier: "starter", period: "monthly", tokensTotal: 500 },
  "price_1TPUtYEbEc6ySyqKumGJeOey": { tier: "starter", period: "yearly", tokensTotal: 500 },
  // Growth
  "price_1TPV6GEbEc6ySyqKxlb9FD0Z": { tier: "growth", period: "monthly", tokensTotal: 1500 },
  "price_1TPUx9EbEc6ySyqKj2ggcIIK": { tier: "growth", period: "yearly", tokensTotal: 1500 },
  // Empire
  "price_1TPV5kEbEc6ySyqK7ZDQobWH": { tier: "empire", period: "monthly", tokensTotal: 3000 },
  "price_1TPUyXEbEc6ySyqKMRSh5vwS": { tier: "empire", period: "yearly", tokensTotal: 3000 },
};

// Tier → price IDs for checkout
export const TIER_PRICES: Record<string, { monthly: string; yearly: string }> = {
  starter: { monthly: "price_1TPV6dEbEc6ySyqKFjBA3MhJ", yearly: "price_1TPUtYEbEc6ySyqKumGJeOey" },
  growth:  { monthly: "price_1TPV6GEbEc6ySyqKxlb9FD0Z", yearly: "price_1TPUx9EbEc6ySyqKj2ggcIIK" },
  empire:  { monthly: "price_1TPV5kEbEc6ySyqK7ZDQobWH", yearly: "price_1TPUyXEbEc6ySyqKMRSh5vwS" },
};
