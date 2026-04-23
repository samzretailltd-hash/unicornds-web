"use client";
import { useState } from "react";
import { PLANS, SITE } from "@/lib/constants";
import { useGeo, formatPrice } from "@/lib/geo";
import { t } from "@/lib/i18n";
import { auth } from "@/lib/firebase";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const geo = useGeo();

  const handleCheckout = async (tier: string) => {
    setLoading(tier);
    try {
      const user = auth.currentUser;
      if (!user) { window.location.href = "/signup"; return; }

      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tier, period: annual ? "yearly" : "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed. Please try again.");
    } catch { alert("Something went wrong. Please try again."); }
    setLoading(null);
  };

  const handlePortal = async () => {
    try {
      const user = auth.currentUser;
      if (!user) { window.location.href = "/login"; return; }
      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Could not open billing portal.");
    } catch { alert("Something went wrong."); }
  };

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider mb-4">{t('nav.pricing', geo.language)}</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold mb-3">{t('pricing.title', geo.language)}</h2>
          <p className="text-[#a5a0cc]">{t('pricing.subtitle', geo.language)}</p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-12 text-sm">
          <span className={!annual ? "text-white font-bold" : "text-[#a5a0cc]"}>{t('pricing.monthly', geo.language)}</span>
          <button onClick={() => setAnnual(!annual)} className={`w-12 h-6 rounded-full relative transition-colors ${annual ? "bg-[#7C3AED]" : "bg-[#3d3580]"}`} aria-label="Toggle billing">
            <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${annual ? "translate-x-6" : ""}`} />
          </button>
          <span className={annual ? "text-white font-bold" : "text-[#a5a0cc]"}>
            {t('pricing.annual', geo.language)} <span className="bg-[#10B981] text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">{t('pricing.save', geo.language)}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-0">
          {PLANS.map((plan) => {
            const gbpPrice = annual && plan.annual > 0 ? plan.annual / 12 : plan.monthly;
            const displayPrice = formatPrice(gbpPrice, geo);
            const annualTotal = annual && plan.annual > 0 ? `${formatPrice(plan.annual, geo)}${t('pricing.perYear', geo.language)}` : "";
            const icons = { yes: "\u2713", no: "\u2717", ltd: "~" };
            const colors = { yes: "text-[#10B981]", no: "text-[#6b6899]", ltd: "text-[#F59E0B]" };
            const isLoading = loading === plan.id;
            return (
              <div key={plan.id} className={`bg-[#1E1B4B]/50 border rounded-xl p-7 text-center relative card-hover ${plan.popular ? "border-[#7C3AED] border-2" : "border-[#3d3580]"}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-extrabold px-4 py-1 rounded-full tracking-wider">{t('pricing.bestValue', geo.language)}</span>}
                <div className="text-xl font-bold text-white mb-1">{plan.name}</div>
                <div className="text-4xl font-extrabold text-[#F59E0B] my-3">
                  {plan.monthly === 0 ? "Free" : <>{displayPrice}<small className="text-sm font-normal text-[#a5a0cc]">{t('pricing.perMonth', geo.language)}</small></>}
                </div>
                <div className="text-sm text-[#10B981] h-5 mb-2">{annualTotal}</div>
                <div className="text-sm text-[#A78BFA] font-semibold mb-5">{plan.listings}</div>
                <ul className="text-left mb-6 space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="text-xs text-[#a5a0cc] flex items-start gap-2">
                      <span className={`${colors[f.status]} flex-shrink-0`}>{icons[f.status]}</span>{f.text}
                    </li>
                  ))}
                </ul>
                {plan.id === "free" ? (
                  <a href={SITE.chrome_store}
                    className="block w-full py-3 rounded-xl text-sm font-bold transition-all border border-[#3d3580] text-[#a5a0cc] hover:border-[#7C3AED] hover:text-white">
                    {t('pricing.install', geo.language)}
                  </a>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isLoading}
                    className={`block w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${plan.id === "empire" ? "btn-gold" : "btn-primary"}`}
                  >
                    {isLoading ? "Loading..." : plan.id === "empire" ? t('pricing.empire', geo.language) : `${t('pricing.get', geo.language)} ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center mt-8 text-sm text-[#6b6899]">{t('pricing.guarantee', geo.language)}</p>

        <div className="text-center mt-4">
          <button onClick={handlePortal} className="text-sm text-[#A78BFA] hover:text-white transition-colors underline">
            Already subscribed? Manage your plan &rarr;
          </button>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#1E1B4B] to-[#2d2875] border border-[#F59E0B]/30 rounded-2xl p-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-2">&#x1F3E2; Running an Agency?</h3>
              <p className="text-[#a5a0cc] text-sm max-w-lg">Need more than 3,000 listings/month? Managing multiple eBay accounts? We offer <b className="text-[#F59E0B]">custom enterprise packages</b> with unlimited listings, dedicated support, and multi-account management.</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="text-xs bg-[#7C3AED]/20 text-[#A78BFA] px-3 py-1 rounded-full">Unlimited listings</span>
                <span className="text-xs bg-[#7C3AED]/20 text-[#A78BFA] px-3 py-1 rounded-full">Multi-account</span>
                <span className="text-xs bg-[#7C3AED]/20 text-[#A78BFA] px-3 py-1 rounded-full">Priority support</span>
                <span className="text-xs bg-[#7C3AED]/20 text-[#A78BFA] px-3 py-1 rounded-full">Custom API limits</span>
              </div>
            </div>
            <a href="mailto:hello@unicornds.io?subject=Custom%20Enterprise%20Plan"
              className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap">
              Contact Sales &rarr;
            </a>
          </div>
        </div>

        <div className="mt-6 bg-[#1E1B4B]/30 border border-[#3d3580] rounded-xl p-6">
          <p className="text-sm text-[#a5a0cc] text-center">
            <b className="text-[#F59E0B]">&#x1F4A1; Empire Plan Note:</b> Empire is NOT tied to a single eBay account. If you run 2-3 stores, Empire works across ALL of them &mdash; tokens deduct from one shared pool. Perfect for sellers managing multiple accounts.
          </p>
        </div>
      </div>
    </section>
  );
}
