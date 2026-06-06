"use client";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AffData {
  approved: boolean;
  affiliate: { name: string; email: string; ref_code: string; ref_link: string; approved_at: string };
  stats: { total_referrals: number; paid_referrals: number; free_referrals: number; total_earned: number; total_paid: number; total_pending: number; commission_rate: number };
  referrals: { email: string; tier: string; signed_up: string; status: string }[];
  commissions: { id: string; referred_email: string; referred_tier: string; amount: number; paid: boolean; created_at: string }[];
  payouts: { id: string; amount: number; status: string; created_at: string; paid_at?: string }[];
  bank_details: { has_details: boolean; bank_name?: string; account_name?: string; sort_code?: string; account_number?: string };
}

export default function AffiliateDashboardPage() {
  const [data, setData] = useState<AffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "referrals" | "commissions" | "payouts" | "bank">("overview");
  const [copied, setCopied] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [bankForm, setBankForm] = useState({ bank_name: "", account_name: "", sort_code: "", account_number: "", iban: "" });
  const [bankSaving, setBankSaving] = useState(false);
  const [bankMsg, setBankMsg] = useState("");
  const [payoutMsg, setPayoutMsg] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const router = useRouter();

  const getToken = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return "";
    return user.getIdToken();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch("/api/affiliate/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setData(null);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setUpdatedAt(new Date());
      }
    } catch { /* */ }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) { router.push("/login"); return; }
      fetchData();
    });
  }, [router, fetchData]);

  // Auto-refresh: poll every 15s + refresh when tab regains focus (near real-time)
  useEffect(() => {
    const id = setInterval(() => { if (auth.currentUser) fetchData(); }, 15000);
    const onFocus = () => { if (auth.currentUser) fetchData(); };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData]);

  const copyLink = () => {
    if (!data?.affiliate.ref_link) return;
    navigator.clipboard.writeText(data.affiliate.ref_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveBankDetails = async () => {
    setBankSaving(true);
    setBankMsg("");
    try {
      const token = await getToken();
      const res = await fetch("/api/affiliate/dashboard", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_bank", ...bankForm }),
      });
      const d = await res.json();
      if (res.ok) { setBankMsg("✅ Bank details saved!"); fetchData(); }
      else setBankMsg(`❌ ${d.error}`);
    } catch { setBankMsg("❌ Network error"); }
    setBankSaving(false);
  };

  const requestPayout = async () => {
    setPayoutLoading(true);
    setPayoutMsg("");
    try {
      const token = await getToken();
      const res = await fetch("/api/affiliate/dashboard", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_payout" }),
      });
      const d = await res.json();
      if (res.ok) { setPayoutMsg(`✅ ${d.message}`); fetchData(); }
      else setPayoutMsg(`❌ ${d.error}`);
    } catch { setPayoutMsg("❌ Network error"); }
    setPayoutLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-[#a5a0cc]">Loading...</p></div>;
  }

  if (!data || !data.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-10 text-center max-w-md">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-xl font-bold text-white mb-2">Affiliate Access Required</h1>
          <p className="text-sm text-[#a5a0cc] mb-6">You're not an approved affiliate yet. Apply to join our programme and start earning 30% commission.</p>
          <Link href="/affiliate" className="btn-primary px-8 py-3 rounded-lg font-bold text-sm inline-block">Apply Now</Link>
        </div>
      </div>
    );
  }

  const { affiliate, stats } = data;
  const tabs = ["overview", "referrals", "commissions", "payouts", "bank"] as const;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white">Affiliate Dashboard</h1>
            <p className="text-sm text-[#a5a0cc]">Welcome back, {affiliate.name} · {stats.commission_rate}% commission</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              Live{updatedAt ? ` \u00b7 updated ${updatedAt.toLocaleTimeString()}` : ""}
            </span>
            <button onClick={fetchData} className="px-4 py-2 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white transition-colors">Refresh</button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#F59E0B]/20 border border-[#7C3AED]/30 rounded-xl p-5 mb-6">
          <p className="text-xs text-[#A78BFA] font-semibold mb-2">YOUR REFERRAL LINK</p>
          <div className="flex items-center gap-3">
            <input type="text" value={affiliate.ref_link} readOnly className="flex-1 bg-[#0f0e1a] border border-[#3d3580] rounded-lg px-4 py-2.5 text-white text-sm font-mono" />
            <button onClick={copyLink} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${copied ? "bg-[#10B981] text-white" : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"}`}>
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-[#6b6899] mt-2">Share this link on YouTube, social media, blog — anywhere. You earn 30% on every signup&apos;s first payment.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${tab === t ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}>
              {t === "bank" ? "Bank Details" : t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Referrals", value: stats.total_referrals, color: "#A78BFA" },
                { label: "Paid Referrals", value: stats.paid_referrals, color: "#10B981" },
                { label: "Total Earned", value: `£${stats.total_earned.toFixed(2)}`, color: "#F59E0B" },
                { label: "Pending Payout", value: `£${stats.total_pending.toFixed(2)}`, color: "#EF4444" },
              ].map(s => (
                <div key={s.label} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                  <p className="text-xs text-[#a5a0cc] mb-1">{s.label}</p>
                  <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                <h3 className="text-white font-bold mb-2">💰 Request Payout</h3>
                <p className="text-sm text-[#a5a0cc] mb-3">Minimum payout: £25. Current pending: £{stats.total_pending.toFixed(2)}</p>
                {stats.total_pending >= 25 ? (
                  <button onClick={requestPayout} disabled={payoutLoading} className="btn-primary px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                    {payoutLoading ? "Requesting..." : `Request £${stats.total_pending.toFixed(2)} Payout`}
                  </button>
                ) : (
                  <p className="text-xs text-[#6b6899]">You need £{(25 - stats.total_pending).toFixed(2)} more to request a payout.</p>
                )}
                {payoutMsg && <p className="text-sm mt-2">{payoutMsg}</p>}
              </div>

              <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                <h3 className="text-white font-bold mb-2">🏦 Bank Details</h3>
                {data.bank_details.has_details ? (
                  <div className="text-sm text-[#a5a0cc]">
                    <p>{data.bank_details.bank_name} · {data.bank_details.account_name}</p>
                    <p>Account: {data.bank_details.account_number} · Sort: {data.bank_details.sort_code}</p>
                    <button onClick={() => setTab("bank")} className="text-[#A78BFA] text-xs underline mt-2">Edit</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#a5a0cc] mb-2">Add your bank details to receive payouts.</p>
                    <button onClick={() => setTab("bank")} className="text-[#A78BFA] text-sm font-bold underline">Add Bank Details →</button>
                  </div>
                )}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-[#0f0e1a] border border-[#3d3580] rounded-xl p-5">
              <h3 className="text-white font-bold mb-3">📖 How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#a5a0cc]">
                <div><span className="text-[#F59E0B] font-bold">1.</span> Share your referral link on YouTube, social media, forums, or your blog.</div>
                <div><span className="text-[#F59E0B] font-bold">2.</span> Someone signs up and pays for any plan — you earn 30% of their first payment.</div>
                <div><span className="text-[#F59E0B] font-bold">3.</span> Request a payout when you reach £25. We transfer to your bank within 5 business days.</div>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Tab */}
        {tab === "referrals" && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#3d3580]">
              <h3 className="text-white font-bold">Your Referrals ({data.referrals.length})</h3>
            </div>
            {data.referrals.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-[#a5a0cc]">No referrals yet. Share your link to start earning!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-[#6b6899] text-xs border-b border-[#3d3580]">
                    <th className="text-left p-3">Email</th><th className="text-left p-3">Plan</th><th className="text-left p-3">Status</th><th className="text-left p-3">Signed Up</th>
                  </tr></thead>
                  <tbody>
                    {data.referrals.map((r, i) => (
                      <tr key={i} className="border-b border-[#3d3580]/50 hover:bg-[#3d3580]/10">
                        <td className="p-3 text-white">{r.email}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${r.tier === "free" ? "bg-[#6b6899]/20 text-[#a5a0cc]" : "bg-[#10B981]/20 text-[#10B981]"}`}>{r.tier.toUpperCase()}</span></td>
                        <td className="p-3 text-[#a5a0cc]">{r.status}</td>
                        <td className="p-3 text-[#6b6899]">{r.signed_up ? new Date(r.signed_up).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Commissions Tab */}
        {tab === "commissions" && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#3d3580] flex items-center justify-between">
              <h3 className="text-white font-bold">Commission History</h3>
              <p className="text-sm text-[#a5a0cc]">Total: £{stats.total_earned.toFixed(2)} · Paid: £{stats.total_paid.toFixed(2)} · Pending: £{stats.total_pending.toFixed(2)}</p>
            </div>
            {data.commissions.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-4xl mb-3">💰</p>
                <p className="text-[#a5a0cc]">No commissions yet. Once your referrals make their first payment, commissions appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-[#6b6899] text-xs border-b border-[#3d3580]">
                    <th className="text-left p-3">Referral</th><th className="text-left p-3">Plan</th><th className="text-left p-3">Commission</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th>
                  </tr></thead>
                  <tbody>
                    {data.commissions.map((c: any) => (
                      <tr key={c.id} className="border-b border-[#3d3580]/50 hover:bg-[#3d3580]/10">
                        <td className="p-3 text-white">{c.referred_email}</td>
                        <td className="p-3 text-[#a5a0cc]">{(c.referred_tier || "").toUpperCase()}</td>
                        <td className="p-3 text-[#F59E0B] font-bold">£{(c.amount || 0).toFixed(2)}</td>
                        <td className="p-3">{c.paid ? <span className="text-[#10B981] text-xs font-bold">PAID</span> : <span className="text-[#F59E0B] text-xs font-bold">PENDING</span>}</td>
                        <td className="p-3 text-[#6b6899]">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payouts Tab */}
        {tab === "payouts" && (
          <div className="space-y-4">
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">Available Balance: £{stats.total_pending.toFixed(2)}</p>
                <p className="text-xs text-[#6b6899]">Minimum payout: £25 · Paid via bank transfer within 5 business days</p>
              </div>
              {stats.total_pending >= 25 && data.bank_details.has_details ? (
                <button onClick={requestPayout} disabled={payoutLoading} className="btn-primary px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50">
                  {payoutLoading ? "Requesting..." : "Request Payout"}
                </button>
              ) : !data.bank_details.has_details ? (
                <button onClick={() => setTab("bank")} className="text-[#A78BFA] text-sm font-bold underline">Add bank details first</button>
              ) : null}
            </div>
            {payoutMsg && <p className="text-sm bg-[#1E1B4B]/50 border border-[#3d3580] rounded-lg p-3">{payoutMsg}</p>}

            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#3d3580]"><h3 className="text-white font-bold">Payout History</h3></div>
              {data.payouts.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-4xl mb-3">🏦</p>
                  <p className="text-[#a5a0cc]">No payouts yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-[#6b6899] text-xs border-b border-[#3d3580]">
                      <th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-left p-3">Requested</th><th className="text-left p-3">Paid</th>
                    </tr></thead>
                    <tbody>
                      {data.payouts.map((p: any) => (
                        <tr key={p.id} className="border-b border-[#3d3580]/50">
                          <td className="p-3 text-white font-bold">£{(p.amount || 0).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              p.status === "paid" ? "bg-[#10B981]/20 text-[#10B981]" :
                              p.status === "rejected" ? "bg-[#EF4444]/20 text-[#EF4444]" :
                              "bg-[#F59E0B]/20 text-[#F59E0B]"
                            }`}>{(p.status || "pending").toUpperCase()}</span>
                          </td>
                          <td className="p-3 text-[#6b6899]">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                          <td className="p-3 text-[#6b6899]">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bank Details Tab */}
        {tab === "bank" && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 max-w-lg">
            <h3 className="text-white font-bold mb-1">Bank Details</h3>
            <p className="text-xs text-[#6b6899] mb-5">Your bank details are stored securely and only used for payouts.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#a5a0cc] mb-1 block">Bank Name *</label>
                <input type="text" value={bankForm.bank_name} onChange={e => setBankForm({ ...bankForm, bank_name: e.target.value })}
                  placeholder="e.g. Barclays, HSBC, Monzo" className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[#a5a0cc] mb-1 block">Account Holder Name *</label>
                <input type="text" value={bankForm.account_name} onChange={e => setBankForm({ ...bankForm, account_name: e.target.value })}
                  placeholder="Full name on the account" className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Sort Code</label>
                  <input type="text" value={bankForm.sort_code} onChange={e => setBankForm({ ...bankForm, sort_code: e.target.value })}
                    placeholder="12-34-56" maxLength={8} className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
                </div>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Account Number</label>
                  <input type="text" value={bankForm.account_number} onChange={e => setBankForm({ ...bankForm, account_number: e.target.value })}
                    placeholder="12345678" maxLength={8} className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#a5a0cc] mb-1 block">IBAN (for international affiliates)</label>
                <input type="text" value={bankForm.iban} onChange={e => setBankForm({ ...bankForm, iban: e.target.value })}
                  placeholder="GB29 NWBK 6016 1331 9268 19" className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
              </div>
              {bankMsg && <p className="text-sm">{bankMsg}</p>}
              <button onClick={saveBankDetails} disabled={bankSaving || !bankForm.bank_name || !bankForm.account_name}
                className="btn-primary px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 w-full">
                {bankSaving ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
