"use client";
import { useEffect, useState } from "react";

const C = { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B", bg: "#0F0D2E", card: "#242150", text: "#EEECFB", sub: "#A9A4D6", border: "#39356B" };
const inputStyle: React.CSSProperties = { padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#1A1740", color: C.text, fontSize: 14 };

export default function AdminAffiliates() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<"pending" | "active">("pending");

  async function load() {
    const r = await fetch("/api/admin/affiliates");
    if (r.status === 401) { setAuthed(false); return; }
    const d = await r.json();
    setData(d); setAuthed(true);
  }
  useEffect(() => { load(); }, []);

  async function login() {
    setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (!r.ok) { const d = await r.json(); setErr(d.error || "Login failed."); return; }
    load();
  }
  async function patch(id: string, body: any) {
    await fetch("/api/admin/affiliates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) });
    load();
  }
  async function payout(a: any) {
    const amount = prompt(`Pay out how much to ${a.name}? Pending: £${a.pendingEarnings.toFixed(2)}`, a.pendingEarnings.toFixed(2));
    if (!amount) return;
    const r = await fetch("/api/admin/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ affiliateId: a.id, amount: Number(amount) }) });
    const d = await r.json();
    if (!r.ok) { alert(d.error || "Payout failed."); return; }
    load();
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Admin access</h1>
          {err && <div style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{err}</div>}
          <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 14 }} type="password" placeholder="Admin password" value={pw}
            onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          <button onClick={login} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: C.gold, color: C.navy, fontWeight: 700, cursor: "pointer" }}>Enter</button>
        </div>
      </main>
    );
  }
  if (!data) return <main style={{ minHeight: "100vh", background: C.bg, color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>;

  const all = data.affiliates || [];
  const ab = data.ab || {};
  const pending = all.filter((a: any) => a.status === "pending");
  const active = all.filter((a: any) => a.status !== "pending");
  const list = tab === "pending" ? pending : active;
  const totalPending = all.reduce((s: number, a: any) => s + (a.pendingEarnings || 0), 0);
  const totalPaid = all.reduce((s: number, a: any) => s + (a.paidEarnings || 0), 0);
  const tabBtn = (t: "pending" | "active", label: string) => (
    <button onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer",
      background: tab === t ? C.purple : "transparent", color: tab === t ? "#fff" : C.sub, fontWeight: 600, fontSize: 14, marginRight: 8 }}>{label}</button>
  );

  return (
    <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>Affiliate admin</h1>
        <p style={{ color: C.sub, marginTop: 0, marginBottom: 24 }}>{pending.length} pending · {active.length} active · £{totalPending.toFixed(2)} owed · £{totalPaid.toFixed(2)} paid</p>

        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>A/B test: landing page</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 32 }}>
          {["A", "B"].map((v) => {
            const d = ab[`aff_landing:${v}`] || { impressions: 0, conversions: 0 };
            const rate = d.impressions ? ((d.conversions / d.impressions) * 100).toFixed(1) : "0.0";
            return <div key={v} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Variant {v}</div>
              <div style={{ color: C.sub, fontSize: 14 }}>{d.impressions} views · {d.conversions} applied</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, marginTop: 6 }}>{rate}%</div>
            </div>;
          })}
        </div>

        <div style={{ marginBottom: 16 }}>{tabBtn("pending", `Pending (${pending.length})`)}{tabBtn("active", `Active (${active.length})`)}</div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 900 }}>
            <thead><tr>{["Name", "Applied with", "Code", "Tier", "Pending", "Status", "Actions"].map((h) =>
              <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: C.sub, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={7} style={{ padding: 24, color: C.sub }}>{tab === "pending" ? "No pending applications." : "No active affiliates yet."}</td></tr>}
              {list.map((a: any, i: number) => (
                <tr key={a.id}>
                  <td style={td(i, list.length)}><div style={{ fontWeight: 600 }}>{a.name}</div><div style={{ color: C.sub, fontSize: 12 }}>{a.email}</div></td>
                  <td style={{ ...td(i, list.length), maxWidth: 240 }}>
                    <div style={{ color: C.text, fontSize: 13 }}>{a.website || "—"}</div>
                    <div style={{ color: C.sub, fontSize: 12 }}>{a.audience || ""}</div>
                  </td>
                  <td style={td(i, list.length)}><code style={{ color: C.gold }}>{a.code}</code></td>
                  <td style={td(i, list.length)}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                      background: a.tier === "selected" ? "rgba(124,58,237,0.25)" : "rgba(169,164,214,0.12)", color: a.tier === "selected" ? "#C4B5FD" : C.sub }}>{a.tier}</span>
                  </td>
                  <td style={{ ...td(i, list.length), color: C.gold, fontWeight: 600 }}>£{a.pendingEarnings.toFixed(2)}</td>
                  <td style={td(i, list.length)}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, ...statusStyle(a.status) }}>{a.status}</span>
                  </td>
                  <td style={{ ...td(i, list.length), whiteSpace: "nowrap" }}>
                    {a.status === "pending" && <>
                      <button onClick={() => patch(a.id, { status: "active" })} style={btn(C.gold, C.navy)}>Approve</button>
                      <button onClick={() => patch(a.id, { status: "rejected" })} style={btn("transparent", "#FCA5A5", true)}>Reject</button>
                    </>}
                    {a.status !== "pending" && <>
                      <button onClick={() => payout(a)} style={btn(C.gold, C.navy)}>Pay out</button>
                      {a.tier === "selected"
                        ? <button onClick={() => patch(a.id, { tier: "standard" })} style={btn("transparent", "#C4B5FD", true)}>Unselect</button>
                        : <button onClick={() => patch(a.id, { tier: "selected" })} style={btn("transparent", "#C4B5FD", true)}>Make selected</button>}
                      {a.status === "active"
                        ? <button onClick={() => patch(a.id, { status: "suspended" })} style={btn("transparent", "#FCA5A5", true)}>Suspend</button>
                        : <button onClick={() => patch(a.id, { status: "active" })} style={btn("transparent", "#4ADE80", true)}>Activate</button>}
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function statusStyle(s: string): React.CSSProperties {
  if (s === "active") return { background: "rgba(34,197,94,0.15)", color: "#4ADE80" };
  if (s === "pending") return { background: "rgba(245,158,11,0.15)", color: "#F59E0B" };
  return { background: "rgba(239,68,68,0.15)", color: "#FCA5A5" };
}
function td(i: number, len: number): React.CSSProperties {
  return { padding: "12px 14px", borderBottom: i < len - 1 ? "1px solid #39356B" : "none", verticalAlign: "top" };
}
function btn(bg: string, color: string, border?: boolean): React.CSSProperties {
  return { background: bg, color, border: border ? "1px solid #39356B" : "none", padding: "6px 12px", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer", marginRight: 6, marginBottom: 4 };
}
