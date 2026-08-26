"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "29.99",
    yearlyPrice: "23.99",
    fullListings: "500",
    trialListings: "25",
    trialFee: "1",
    features: ["AI Cassini SEO titles", "Bulk Lister", "Product Hunter", "VERO Protection (3,390 brands)", "Email support"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "59.99",
    yearlyPrice: "47.99",
    fullListings: "1,500",
    trialListings: "50",
    trialFee: "5",
    features: ["AI Cassini SEO titles", "Bulk Lister (5 concurrent)", "Product Hunter + Demand Score", "VERO Protection (3,390 brands)", "Competitor Scanner", "Priority support"],
    popular: true,
  },
  {
    id: "empire",
    name: "Empire",
    price: "99.99",
    yearlyPrice: "79.99",
    fullListings: "3,000",
    trialListings: "100",
    trialFee: "10",
    features: ["AI Cassini SEO titles", "Bulk Lister (10 concurrent)", "Product Hunter + Demand Score", "VERO Protection (3,390 brands)", "Competitor Scanner", "eBay Sold Check", "Dedicated support"],
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

  const handleCheckout = async (planId: string, mode: "trial" | "full") => {
    if (!user || processing) return;
    setSelectedPlan(`${planId}-${mode}`);
    setProcessing(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tier: planId, period, mode }),
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-lg text-[#a5a0cc]">
            Choose your plan and get full access instantly
          </p>
        </div>

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
              Yearly <span className="text-[#10B981] text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const displayPrice = period === "yearly" ? plan.yearlyPrice : plan.price;
            const isTrialProcessing = false; // trials discontinued
            const isFullProcessing = processing && selectedPlan === `${plan.id}-full`;

            return (
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
                  <div className="mb-1">
                    <span className="text-3xl font-extrabold text-white">&pound;{displayPrice}</span>
                    <span className="text-sm text-[#a5a0cc]">/mo</span>
                  </div>
                  <p className="text-xs text-[#a5a0cc]">{plan.fullListings} listings/month</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#c4c0e0]">
                      <span className="text-[#10B981] mt-0.5 flex-shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <button
                    onClick={() => handleCheckout(plan.id, "full")}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      isFullProcessing
                        ? "bg-[#7C3AED]/50 text-white/50 cursor-wait"
                        : plan.popular
                        ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                        : "bg-[#7C3AED]/80 hover:bg-[#7C3AED] text-white"
                    }`}
                  >
                    {isFullProcessing
                      ? "Redirecting..."
                      : `Full Access \u00B7 \u00A3${displayPrice}/mo \u00B7 ${plan.fullListings} listings`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-[#6b6899]">&#128274; Secure payment via Stripe — we never see your card details</p>
          <p className="text-xs text-[#6b6899]">Cancel anytime from your dashboard — no questions asked</p>
        </div>
      </div>
    </div>
  );
}
