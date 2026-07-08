// Central config for the whole affiliate system. Change values here only.
export const AFFILIATE_CONFIG = {
  currency: "GBP",
  currencySymbol: "£",
  cookieDays: 30,               // referral cookie lifetime
  minPayout: 50,                // minimum £ balance before payout

  // Recurring commission per referred customer's plan.
  // Paid on the first successful payment (onboarding) AND every monthly renewal.
  // "standard" = normal affiliate, "selected" = promoted affiliate (set in admin).
  commissions: {
    starter: { standard: 5,  selected: 5 },
    growth:  { standard: 10, selected: 15 },
    empire:  { standard: 30, selected: 30 },
  } as Record<string, { standard: number; selected: number }>,

  plans: ["starter", "growth", "empire"],

  brand: { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B" },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.unicornds.io",
};

// Returns the £ commission for a plan + affiliate tier. 0 if plan unknown.
export function commissionFor(plan: string, tier: string): number {
  const p = AFFILIATE_CONFIG.commissions[String(plan || "").toLowerCase()];
  if (!p) return 0;
  return tier === "selected" ? p.selected : p.standard;
}
