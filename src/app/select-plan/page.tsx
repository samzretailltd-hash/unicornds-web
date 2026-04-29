"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "23.99",
    yearlyPrice: "19.99",
    listings: "500",
    features: ["500 eBay listings/month", "AI Cassini SEO titles", "Bulk Lister", "Product Hunter", "VERO Protection (3,390 brands)", "Email support"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "47.99",
    yearlyPrice: "39.99",
    listings: "1,500",
    features: ["1,500 eBay listings/month", "AI Cassini SEO titles", "Bulk Lister (5 concurrent)", "Product Hunter + Demand Score", "VERO Protection (3,390 brands)", "Competitor Scanner", "Priority support"],
    popular: true,
  },
  {
    id: "empire",
    name: "Empire",
    price: "79.99",
    yearlyPrice: "66.99",
    listings: "3,000",
    features: ["3,000 eBay listings/month", "AI Cassini SEO titles", "Bulk Lister (10 concurrent)", "Product Hunter + Demand Score", "VERO Protection (3,390 brands)", "Competitor Scanner", "eBay Sold Check", "Dedicated support"],
    popular: false,
  },
];

export default function SelectPlanPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      if (!u.emailVerified) { router.push("/verify-email"); return; }
      setUser(u);
      setLoading(false);
    });
  }, [router]);

  const handleSelectPlan = async (planId: string) => {
    if (!user || processing) return;
    setSelectedPlan(planId);
    setProcessing(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tier: planId, period, trial: true }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setProcessing(false);
        setSelectedPlan(null);
      }
    } catch {
      alert("Network error. Please try again.");
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-[#a5a0cc]">Loading...</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-lg text-[#a5a0cc] mb-2">
            Every plan includes a <span className="text-[#F59E0B] font-bold">14-day free trial</span>
          </p>
          <p className="text-sm text-[#6b6899]">
            Your card is captured for verification only — you will NOT be charged today.
            <br />Cancel anytime during the trial and pay nothing.
          </p>
        </div>

        {/* Period Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1E1B4B]/60 border border-[#3d3580] rounded-xl p-1 flex">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${period === "monthly" ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${period === "yearly" ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}
            >
              Yearly <span className="text-[#10B981] text-xs ml-1">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                plan.popular
                  ? "border-[#7C3AED] bg-[#1E1B4B]/60 scale-[1.02]"
                  : "border-[#3d3580]/50 bg-[#0d0b1a]/80 hover:border-[#7C3AED]/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#7C3AED] text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-5">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#6b6899] mb-3">{plan.listings} listings/month</p>
                <div className="mb-1">
                  <span className="text-3xl font-extrabold text-white">
                    £{period === "yearly" ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-sm text-[#a5a0cc]">/mo</span>
                </div>
                <p className="text-xs text-[#F59E0B] font-semibold">14 days FREE — then £{period === "yearly" ? plan.yearlyPrice : plan.price}/mo</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#c4c0e0]">
                    <span className="text-[#10B981] mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={processing}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  processing && selectedPlan === plan.id
                    ? "bg-[#7C3AED]/50 text-white/50 cursor-wait"
                    : plan.popular
                    ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    : "border border-[#7C3AED]/50 text-white hover:bg-[#7C3AED]/10"
                }`}
              >
                {processing && selectedPlan === plan.id ? "Redirecting to Stripe..." : "Start 14-Day Free Trial"}
              </button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-[#6b6899]">🔒 Secure payment via Stripe — we never see your card details</p>
          <p className="text-xs text-[#6b6899]">Cancel anytime from your dashboard — no questions asked</p>
        </div>
      </div>
    </div>
  );
}
