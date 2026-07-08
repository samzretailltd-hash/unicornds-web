"use client";
import { Suspense, useState } from "react";
import Link from "next/link";

const C = { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B", bg: "#0F0D2E", card: "#242150", text: "#EEECFB", sub: "#A9A4D6", border: "#39356B" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#1A1740", color: C.text, fontSize: 15, marginBottom: 14, boxSizing: "border-box" };

function ApplyForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", paypalEmail: "", website: "", audience: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setErr(""); setLoading(true);
    try {
      const r = await fetch("/api/affiliate/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Application failed."); setLoading(false); return; }
      setDone(true);
    } catch { setErr("Network error."); setLoading(false); }
  }

  if (done) {
    return (
      <div style={{ width: "100%", maxWidth: 440, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🦄</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>Application received</h1>
        <p style={{ color: C.sub, fontSize: 15, lineHeight: 1.5 }}>Thanks for applying to the UnicornDS affiliate program. We review every application. If you qualify, we'll approve your account and email you so you can log in and get your referral link.</p>
        <Link href="/" style={{ display: "inline-block", marginTop: 20, color: C.gold, fontWeight: 600 }}>Back to homepage</Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 460, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>Apply to become an affiliate</h1>
      <p style={{ color: C.sub, margin: "0 0 24px", fontSize: 14 }}>We review each application. Approved partners earn recurring commission.</p>
      {err && <div style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{err}</div>}
      <input style={inputStyle} placeholder="Full name" value={form.name} onChange={set("name")} />
      <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={set("email")} />
      <input style={inputStyle} placeholder="Password (min 6 characters)" type="password" value={form.password} onChange={set("password")} />
      <input style={inputStyle} placeholder="Website / YouTube / social link" value={form.website} onChange={set("website")} />
      <input style={inputStyle} placeholder="Your audience (e.g. 5k eBay sellers on YouTube)" value={form.audience} onChange={set("audience")} />
      <input style={inputStyle} placeholder="PayPal email (for payouts) — optional" type="email" value={form.paypalEmail} onChange={set("paypalEmail")} />
      <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: C.gold, color: C.navy, fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Submitting..." : "Submit application"}
      </button>
      <p style={{ textAlign: "center", color: C.sub, fontSize: 14, marginTop: 18 }}>
        Already approved? <Link href="/affiliate/login" style={{ color: C.gold }}>Log in</Link>
      </p>
    </div>
  );
}

export default function Signup() {
  return (
    <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Suspense fallback={<div style={{ color: C.sub }}>Loading...</div>}>
        <ApplyForm />
      </Suspense>
    </main>
  );
}
