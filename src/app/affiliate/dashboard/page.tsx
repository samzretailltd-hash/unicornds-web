"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const C = { navy: "#1E1B4B", purple: "#7C3AED", gold: "#F59E0B", bg: "#0F0D2E", card: "#242150", text: "#EEECFB", sub: "#A9A4D6", border: "#39356B" };

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/affiliate/me")
      .then(async (r) => {
        if (r.status === 401) { router.push("/affiliate/login"); return; }
        const d = await r.json();
        if (!r.ok) { setErr(d.error || "Could not load dashboard."); return; }
        setData(d);
      })
      .catch(() => setErr("Network error."));
  }, [router]);

  async function logout() {
    await fetch("/api/affiliate/logout", { method: "POST" });
    router.push("/affiliate/login");
  }

  if (err) return <Center>{err}</Center>;
  if (!data) return <Center>Loading...</Center>;

  const { profile, stats, conversions, payments, config } = data;
  const sym = config.currencySymbol;
  const link = `${config.siteUrl}/api/affiliate/track?ref=${profile.code}`;
  const selected = profile.tier === "selected";

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Hi {profile.name.split(" ")[0]} 🦄</h1>
          <button onClick={logout} style={{ background: "transparent", color: C.sub, border: `1px solid ${C.border}`, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Log out</button>
        </div>
        <p style={{ color: C.sub, marginTop: 0, marginBottom: 24 }}>
          You earn recurring commission every month your referrals stay subscribed. Payouts from {sym}{config.minPayout}.
          {selected && <span style={{ color: C.gold, fontWeight: 600 }}> You're a Selected affiliate — upgraded rates.</span>}
        </p>

        {/* your rates */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {config.plans.map((plan: string) => (
            <div key={plan} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ color: C.sub, fontSize: 13, textTransform: "capitalize" }}>{plan}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginTop: 4 }}>{sym}{config.rates[plan]}<span style={{ color: C.sub, fontSize: 12, fontWeight: 400 }}>/mo</span></div>
            </div>
          ))}
        </div>

        {/* referral link */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ color: C.sub, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>YOUR REFERRAL LINK</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <code style={{ flex: 1, minWidth: 220, background: "#1A1740", padding: "12px 14px", borderRadius: 8, color: C.gold, fontSize: 14, overflowX: "auto" }}>{link}</code>
            <button onClick={copy} style={{ background: C.gold, color: C.navy, border: "none", padding: "0 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div style={{ color: C.sub, fontSize: 13, marginTop: 10 }}>Your code: <b style={{ color: C.text }}>{profile.code}</b></div>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
          <Stat label="Clicks" value={stats.clicks} />
          <Stat label="Active payments" value={stats.conversions} />
          <Stat label="Pending" value={`${sym}${stats.pendingEarnings.toFixed(2)}`} accent />
          <Stat label="Paid out" value={`${sym}${stats.paidEarnings.toFixed(2)}`} />
          <Stat label="Total earned" value={`${sym}${stats.totalEarnings.toFixed(2)}`} />
        </div>

        {/* conversions */}
        <Section title="Commission history">
          {conversions.length === 0 ? <Empty>No commissions yet. Share your link to get started.</Empty> :
            <Table head={["Date", "Plan", "Commission", "Status"]}
              rows={conversions.map((c: any) => [
                new Date(c.createdAt).toLocaleDateString(),
                <span key="p" style={{ textTransform: "capitalize" }}>{c.plan || "-"}</span>,
                `${sym}${Number(c.commission).toFixed(2)}`,
                <Badge key="s" ok={c.status === "paid"}>{c.status}</Badge>,
              ])} />}
        </Section>

        {/* payments */}
        <Section title="Payout history">
          {payments.length === 0 ? <Empty>No payouts yet.</Empty> :
            <Table head={["Date", "Amount", "Method"]}
              rows={payments.map((p: any) => [
                new Date(p.createdAt).toLocaleDateString(),
                `${sym}${Number(p.amount).toFixed(2)}`,
                p.method,
              ])} />}
        </Section>
      </div>
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <main style={{ minHeight: "100vh", background: C.bg, color: C.sub, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>{children}</main>;
}
function Stat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
    <div style={{ color: C.sub, fontSize: 13 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: accent ? C.gold : C.text }}>{value}</div>
  </div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 28 }}>
    <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>{children}</div>
  </div>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 24, color: C.sub, fontSize: 14 }}>{children}</div>;
}
function Table({ head, rows }: { head: string[]; rows: any[][] }) {
  return <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
    <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: C.sub, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "12px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>{c}</td>)}</tr>)}</tbody>
  </table>;
}
function Badge({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: ok ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: ok ? "#4ADE80" : C.gold }}>{children}</span>;
}
