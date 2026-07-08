"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const C = { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B", bg: "#0F0D2E", card: "#242150", text: "#EEECFB", sub: "#A9A4D6", border: "#39356B" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#1A1740", color: C.text, fontSize: 15, marginBottom: 14, boxSizing: "border-box" };

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr(""); setLoading(true);
    try {
      const r = await fetch("/api/affiliate/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Login failed."); setLoading(false); return; }
      router.push("/affiliate/dashboard");
    } catch { setErr("Network error."); setLoading(false); }
  }

  return (
    <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 24px" }}>Affiliate login</h1>
        {err && <div style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{err}</div>}
        <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && submit()} />
        <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: C.gold, color: C.navy, fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p style={{ textAlign: "center", color: C.sub, fontSize: 14, marginTop: 18 }}>
          No account? <Link href="/affiliate/signup" style={{ color: C.gold }}>Sign up</Link>
        </p>
      </div>
    </main>
  );
}
