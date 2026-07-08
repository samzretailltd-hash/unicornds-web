"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const C = { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B", bg: "#0F0D2E", card: "#242150", text: "#EEECFB", sub: "#A9A4D6", border: "#39356B" };

const VARIANTS: Record<string, { headline: string; sub: string; cta: string }> = {
  A: {
    headline: "Earn recurring commission every month you refer",
    sub: "Refer sellers to UnicornDS and earn £5–£30 every single month they stay subscribed. Paid in GBP via PayPal.",
    cta: "Join the program",
  },
  B: {
    headline: "Turn your audience into monthly recurring income",
    sub: "Promote the #1 Chrome extension for eBay sellers. Earn £5–£30 per active subscriber, every month — not just once.",
    cta: "Start earning today",
  },
};

export default function AffiliateLanding() {
  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    let v = document.cookie.split("; ").find((c) => c.startsWith("ab_aff="))?.split("=")[1] as "A" | "B" | undefined;
    if (v !== "A" && v !== "B") {
      v = Math.random() < 0.5 ? "A" : "B";
      document.cookie = `ab_aff=${v}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
    setVariant(v);
    fetch("/api/ab", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "aff_landing", variant: v, event: "impression" }) }).catch(() => {});
  }, []);

  const data = VARIANTS[variant];

  return (
    <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: "rgba(245,158,11,0.12)", color: C.gold, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          UnicornDS Affiliate Program
        </div>
        <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 800, margin: "0 0 20px" }}>{data.headline}</h1>
        <p style={{ fontSize: 19, color: C.sub, margin: "0 0 32px", lineHeight: 1.5 }}>{data.sub}</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
          <Link href={`/affiliate/signup?v=${variant}`} style={{ background: C.gold, color: C.navy, padding: "14px 28px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
            {data.cta}
          </Link>
          <Link href="/affiliate/login" style={{ background: "transparent", color: C.text, padding: "14px 28px", borderRadius: 10, fontWeight: 600, textDecoration: "none", fontSize: 16, border: `1px solid ${C.border}` }}>
            Already a partner? Log in
          </Link>
        </div>

        {/* commission table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <div style={{ color: C.sub, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>WHAT YOU EARN — EVERY MONTH, PER ACTIVE SUBSCRIBER</div>
          {[["Starter", "£5"], ["Growth", "£10–£15"], ["Empire", "£30"]].map(([plan, amt]) => (
            <div key={plan} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: plan !== "Empire" ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontWeight: 600 }}>{plan} plan</span>
              <span style={{ color: C.gold, fontWeight: 800 }}>{amt} <span style={{ color: C.sub, fontWeight: 400, fontSize: 13 }}>/mo</span></span>
            </div>
          ))}
        </div>
        <p style={{ color: C.sub, fontSize: 13 }}>Recurring for as long as your referral stays subscribed. £50 minimum payout, paid via PayPal. Top affiliates get upgraded rates.</p>
      </div>
    </main>
  );
}
