"use client";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

const ADMIN_EMAILS = ["1stunicorndistribution@gmail.com", "zohaib219@gmail.com", "support@unicornds.io"];
const TIERS = ["free", "starter", "growth", "empire"];
const TIER_COLORS: Record<string, string> = { free: "#6b6899", starter: "#7C3AED", growth: "#10B981", empire: "#F59E0B" };

interface UserData { uid: string; email?: string; fullName?: string; phone?: string; country?: string; tier?: string; status?: string; ref?: string; signup_ip?: string; last_ip?: string; created_at?: unknown; billing_period_end?: string; trial_end?: string; tokensUsed?: number; tokensTotal?: number; card_verified?: boolean; usage?: Record<string, unknown>; }
interface Stats { users: { total: number; free: number; starter: number; growth: number; empire: number }; payments: unknown[]; revenue: { total: number; currency: string }; }

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"overview" | "users" | "payments" | "affiliates" | "settings" | "health">("overview");
  const [role, setRole] = useState<"owner" | "support">("support");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState({ min_version: "6.0.0", latest_version: "6.3.0", maintenance: false, message: "" });
  const [saving, setSaving] = useState(false);
  const [affiliates, setAffiliates] = useState<{id:string;name?:string;email?:string;website?:string;audience?:string;promotion_plan?:string;status?:string;applied_at?:string;ref_code?:string;ip?:string}[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
  }, []);

  const getToken = useCallback(async () => {
    if (!user) return "";
    return user.getIdToken();
  }, [user]);

  const fetchData = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, usersRes, settingsRes, affRes] = await Promise.all([
        fetch("/api/admin/stats", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/settings", { headers }),
        fetch("/api/admin/affiliates", { headers }),
      ]);
      if (statsRes.ok) { const s = await statsRes.json(); setStats(s); if (s.role) setRole(s.role); }
      if (usersRes.ok) { const d = await usersRes.json(); setUsers(d.users || []); }
      if (settingsRes.ok) { const d = await settingsRes.json(); setSettings(s => ({ ...s, ...d })); }
      if (affRes.ok) { const d = await affRes.json(); setAffiliates(d.applications || []); }
    } catch (err) { console.error("Fetch error:", err); }
  }, [getToken]);

  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email || "")) fetchData();
  }, [user, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch { setLoginError("Invalid credentials"); }
  };

  const updateTier = async (uid: string, tier: string) => {
    const token = await getToken();
    const end = new Date(); end.setMonth(end.getMonth() + 1);
    const tokenTotals: Record<string, number> = { free: 20, starter: 500, growth: 1500, empire: 3000 };
    await fetch("/api/admin/update-tier", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        uid, tier,
        tokensTotal: tokenTotals[tier] || 100,
        // DON'T reset tokensUsed — keep their current usage
        billing_period_end: ["starter", "growth", "empire"].includes(tier) ? end.toISOString() : null,
        trialStartDate: null,
        trialEndDate: null,
      }),
    });
    fetchData();
  };

  const blockUser = async (uid: string, block: boolean) => {
    if (!confirm(block ? "Block this user? They won't be able to use the extension." : "Unblock this user?")) return;
    const token = await getToken();
    await fetch("/api/admin/update-tier", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ uid, status: block ? "blocked" : "active" }),
    });
    fetchData();
  };

  const deleteUsers = async (uids: string[]) => {
    if (!confirm(`Delete ${uids.length} user${uids.length > 1 ? 's' : ''}? This removes them from Firebase Auth AND Firestore. This cannot be undone.`)) return;
    const token = await getToken();
    const res = await fetch("/api/admin/delete-user", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ uids }),
    });
    const data = await res.json();
    if (data.ok) {
      alert(`Deleted ${data.results.filter((r: any) => r.status === "deleted").length} users`);
      setSelectedUsers(new Set());
      fetchData();
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  };

  const handleAffiliate = async (id: string, status: "approved" | "rejected") => {
    const refCode = status === "approved" ? prompt("Enter referral code for this affiliate (e.g. 'empowerers'):") : null;
    if (status === "approved" && !refCode) return;
    const token = await getToken();
    await fetch("/api/admin/affiliates", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, refCode }),
    });
    fetchData();
  };

  const saveSettings = async () => {
    setSaving(true);
    const token = await getToken();
    await fetch("/api/admin/settings", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-[#a5a0cc]">Loading...</p></div>;

  // Login screen
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-display)]">Admin Panel</h1>
          <p className="text-sm text-[#a5a0cc] mb-6">UnicornDS Control Centre</p>
          {user && !ADMIN_EMAILS.includes(user.email || "") && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-400">
              Access denied. {user.email} is not an admin.
              <button onClick={() => signOut(auth)} className="block mt-2 text-red-300 underline">Sign out</button>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full btn-primary py-3 rounded-lg font-bold text-sm">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Admin Dashboard</h1>
            <p className="text-sm text-[#a5a0cc]">Logged in as {user.email}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="px-4 py-2 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white">Refresh</button>
            <button onClick={() => signOut(auth)} className="px-4 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10">Sign Out</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#1E1B4B]/30 rounded-lg p-1 w-fit">
          {(["overview", "users", "payments", "affiliates", "settings", "health"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-[#7C3AED] text-white" : "text-[#a5a0cc] hover:text-white"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                ["Total Users", stats.users.total, "#7C3AED"],
                ["Free", stats.users.free, "#6b6899"],
                ["Free", (stats.users as any).free || 0, "#6b6899"],
                ["Starter", stats.users.starter, "#7C3AED"],
                ["Growth", stats.users.growth, "#10B981"],
                ["Empire", stats.users.empire, "#F59E0B"],
              ].map(([label, value, color]) => (
                <div key={label as string} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                  <div className="text-sm text-[#a5a0cc] mb-1">{label as string}</div>
                  <div className="text-3xl font-bold" style={{ color: color as string }}>{value as number}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                <div className="text-sm text-[#a5a0cc] mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-[#F59E0B]">£{stats.revenue.total.toFixed(2)}</div>
              </div>
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                <div className="text-sm text-[#a5a0cc] mb-1">Monthly Recurring (MRR)</div>
                <div className="text-3xl font-bold text-[#10B981]">£{((stats.revenue as any).monthly || 0).toFixed(2)}</div>
                <div className="text-xs text-[#6b6899] mt-1">Based on active subscriptions</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={async () => {
                  if (!confirm("Sync all subscription data from Stripe? This updates expiry dates and status.")) return;
                  try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await fetch("/api/admin/sync-stripe", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (data.ok) {
                      const synced = data.results.filter((r: any) => r.status.includes("synced")).length;
                      alert(`✅ Synced ${synced} subscriptions from Stripe.\n\n${data.results.map((r: any) => `${r.email}: ${r.status}`).join("\n")}`);
                      fetchData();
                    } else {
                      alert("Error: " + (data.error || "Unknown"));
                    }
                  } catch (e: any) { alert("Failed: " + e.message); }
                }}
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-bold transition-colors"
              >
                🔄 Sync Subscriptions from Stripe
              </button>
            </div>
          </div>
        )}
        {tab === "overview" && !stats && <p className="text-[#a5a0cc]">Loading stats...</p>}

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#a5a0cc]">{users.length} users {selectedUsers.size > 0 && <span className="text-[#F59E0B]">({selectedUsers.size} selected)</span>}</p>
              <div className="flex gap-3">
                {selectedUsers.size > 0 && (
                  <button onClick={() => deleteUsers(Array.from(selectedUsers))}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs font-bold transition-colors">
                    🗑 Delete Selected ({selectedUsers.size})
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (!confirm("Send onboarding invite email to ALL users who haven't received it yet?")) return;
                    try {
                      const token = await auth.currentUser?.getIdToken();
                      const res = await fetch("/api/admin/send-onboarding", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                      });
                      const data = await res.json();
                      if (data.ok) {
                        const sent = data.results.filter((r: any) => r.status.includes("sent")).length;
                        alert(`✅ Onboarding emails sent!\n\n${sent} emails sent out of ${data.total} users.\n\n${data.results.map((r: any) => `${r.email}: ${r.status}`).join("\n")}`);
                      } else {
                        alert("Error: " + (data.error || "Unknown error"));
                      }
                    } catch (e: any) {
                      alert("Failed: " + e.message);
                    }
                  }}
                  className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg text-xs font-bold transition-colors"
                >
                  📧 Send Onboarding Email to All
                </button>
              </div>
            </div>
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2d2766] text-left">
                    <th className="p-3 w-8">
                      <input type="checkbox"
                        checked={selectedUsers.size === users.length && users.length > 0}
                        onChange={e => {
                          if (e.target.checked) setSelectedUsers(new Set(users.map(u => u.uid)));
                          else setSelectedUsers(new Set());
                        }}
                        className="rounded" />
                    </th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Name</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Email</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Tier</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Usage</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Expires</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Phone</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Country</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Status</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">IP</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const used = u.tokensUsed || 0;
                    const total = u.tokensTotal || 0;
                    const usagePercent = total > 0 ? Math.round((used / total) * 100) : 0;
                    const expiryDate = u.trial_end || u.billing_period_end;
                    const daysLeft = expiryDate ? Math.max(0, Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000)) : null;
                    return (
                    <tr key={u.uid} className={`border-t border-[#3d3580]/20 hover:bg-[#2d2766]/30 ${selectedUsers.has(u.uid) ? 'bg-[#7C3AED]/10' : ''}`}>
                      <td className="p-3">
                        <input type="checkbox" checked={selectedUsers.has(u.uid)}
                          onChange={e => {
                            const next = new Set(selectedUsers);
                            if (e.target.checked) next.add(u.uid); else next.delete(u.uid);
                            setSelectedUsers(next);
                          }} className="rounded" />
                      </td>
                      <td className="p-3 text-white text-xs">{u.fullName || "—"}</td>
                      <td className="p-3 text-white text-xs">{u.email || u.uid.slice(0, 12)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: (TIER_COLORS[u.tier || "free"] || "#6b6899") + "20", color: TIER_COLORS[u.tier || "free"] }}>
                          {(u.tier || "free").toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#0f0e1a] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, usagePercent)}%`, background: usagePercent > 90 ? '#EF4444' : usagePercent > 70 ? '#F59E0B' : '#10B981' }} />
                          </div>
                          <span className="text-[#a5a0cc]">{used}/{total}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs">
                        {daysLeft !== null ? (
                          <span className={`${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                            {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                          </span>
                        ) : <span className="text-[#6b6899]">—</span>}
                      </td>
                      <td className="p-3 text-[#a5a0cc] text-xs">{u.phone || "—"}</td>
                      <td className="p-3 text-[#a5a0cc] text-xs">{u.country || "—"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.status === "blocked" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {u.status === "blocked" ? "BLOCKED" : "ACTIVE"}
                        </span>
                      </td>
                      <td className="p-3 text-[#a5a0cc] text-xs font-mono">{u.signup_ip || "—"}</td>
                      <td className="p-3 flex gap-2">
                        <select value={u.tier || "free"} onChange={e => updateTier(u.uid, e.target.value)}
                          className="bg-[#0f0e1a] border border-[#3d3580] rounded px-2 py-1 text-xs text-white">
                          {TIERS.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                        </select>
                        <button onClick={() => blockUser(u.uid, u.status !== "blocked")}
                          className={`px-2 py-1 rounded text-xs font-bold ${u.status === "blocked" ? "bg-green-600/20 text-green-400 hover:bg-green-600/40" : "bg-red-600/20 text-red-400 hover:bg-red-600/40"}`}>
                          {u.status === "blocked" ? "Unblock" : "Block"}
                        </button>
                        <button onClick={async () => {
                          if (!confirm(`Manually verify email for ${u.email}?`)) return;
                          const token = await getToken();
                          const res = await fetch("/api/admin/verify-email", {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ email: u.email }),
                          });
                          const data = await res.json();
                          if (data.ok) alert(`✅ Email verified for ${u.email}`);
                          else alert("Error: " + (data.error || "Unknown"));
                        }}
                          className="px-2 py-1 rounded text-xs font-bold bg-blue-600/20 text-blue-400 hover:bg-blue-600/40">
                          ✓ Verify
                        </button>
                        <button onClick={() => deleteUsers([u.uid])}
                          className="px-2 py-1 rounded text-xs font-bold bg-red-900/20 text-red-500 hover:bg-red-900/40">
                          Del
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr><td colSpan={11} className="p-8 text-center text-[#6b6899]">No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {/* Payments Tab */}
        {tab === "payments" && stats && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2d2766] text-left">
                    <th className="p-4 text-[#a5a0cc] font-medium">Email</th>
                    <th className="p-4 text-[#a5a0cc] font-medium">Amount</th>
                    <th className="p-4 text-[#a5a0cc] font-medium">Plan</th>
                    <th className="p-4 text-[#a5a0cc] font-medium">Status</th>
                    <th className="p-4 text-[#a5a0cc] font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.payments as Record<string, unknown>[]).map((p, i) => (
                    <tr key={i} className="border-t border-[#3d3580]/20">
                      <td className="p-4 text-white">{p.email as string || "—"}</td>
                      <td className="p-4 text-[#F59E0B] font-bold">£{Number(p.amount || 0).toFixed(2)}</td>
                      <td className="p-4 text-[#a5a0cc]">{p.new_tier as string || "—"}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs ${p.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{p.status as string}</span></td>
                      <td className="p-4 text-[#a5a0cc]">{(() => {
                        const d = p.received_at;
                        if (!d) return "—";
                        if (typeof d === "string") return new Date(d).toLocaleDateString();
                        if ((d as Record<string, number>)._seconds) return new Date((d as Record<string, number>)._seconds * 1000).toLocaleDateString();
                        return "—";
                      })()}</td>
                    </tr>
                  ))}
                  {stats.payments.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-[#6b6899]">No payments yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Affiliates Tab */}
        {tab === "affiliates" && (
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#3d3580]/30">
              <h3 className="text-white font-bold">Affiliate Applications ({affiliates.length})</h3>
              <p className="text-xs text-[#6b6899]">Pending: {affiliates.filter(a => a.status === "pending").length} | Approved: {affiliates.filter(a => a.status === "approved").length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2d2766] text-left">
                    <th className="p-3 text-[#a5a0cc] font-medium">Name</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Email</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Website</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Audience</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Method</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Status</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Ref Code</th>
                    <th className="p-3 text-[#a5a0cc] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map(a => (
                    <tr key={a.id} className="border-t border-[#3d3580]/20 hover:bg-[#2d2766]/30">
                      <td className="p-3 text-white text-xs">{a.name || "—"}</td>
                      <td className="p-3 text-white text-xs">{a.email || "—"}</td>
                      <td className="p-3 text-[#a5a0cc] text-xs max-w-[150px] truncate">{a.website || "—"}</td>
                      <td className="p-3 text-[#a5a0cc] text-xs">{a.audience || "—"}</td>
                      <td className="p-3 text-[#a5a0cc] text-xs">{a.promotion_plan || "—"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          a.status === "approved" ? "bg-green-500/20 text-green-400" :
                          a.status === "rejected" ? "bg-red-500/20 text-red-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>{(a.status || "pending").toUpperCase()}</span>
                      </td>
                      <td className="p-3 text-[#F59E0B] text-xs font-mono">{a.ref_code || "—"}</td>
                      <td className="p-3 flex gap-2">
                        {a.status === "pending" && (
                          <>
                            <button onClick={() => handleAffiliate(a.id, "approved")}
                              className="px-2 py-1 rounded text-xs font-bold bg-green-600/20 text-green-400 hover:bg-green-600/40">Approve</button>
                            <button onClick={() => handleAffiliate(a.id, "rejected")}
                              className="px-2 py-1 rounded text-xs font-bold bg-red-600/20 text-red-400 hover:bg-red-600/40">Reject</button>
                          </>
                        )}
                        {a.status === "approved" && <span className="text-xs text-green-400">✓ Active</span>}
                        {a.status === "rejected" && <span className="text-xs text-red-400">✕ Rejected</span>}
                      </td>
                    </tr>
                  ))}
                  {affiliates.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-[#6b6899]">No affiliate applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div className="space-y-6 max-w-xl">
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Extension Control</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Maintenance Mode</div>
                    <div className="text-xs text-[#6b6899]">Blocks all users from using the extension</div>
                  </div>
                  <button onClick={() => setSettings(s => ({ ...s, maintenance: !s.maintenance }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenance ? "bg-red-500" : "bg-[#3d3580]"}`}>
                    <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${settings.maintenance ? "translate-x-6" : ""}`} />
                  </button>
                </div>
                <div>
                  <label className="text-sm text-[#a5a0cc] mb-1 block">Minimum Version</label>
                  <input value={settings.min_version} onChange={e => setSettings(s => ({ ...s, min_version: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm" />
                </div>
                <div>
                  <label className="text-sm text-[#a5a0cc] mb-1 block">Latest Version</label>
                  <input value={settings.latest_version} onChange={e => setSettings(s => ({ ...s, latest_version: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm" />
                </div>
                <div>
                  <label className="text-sm text-[#a5a0cc] mb-1 block">Announcement Message</label>
                  <input value={settings.message} onChange={e => setSettings(s => ({ ...s, message: e.target.value }))} placeholder="Leave empty for none"
                    className="w-full px-3 py-2 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm" />
                </div>
                <button onClick={saveSettings} disabled={saving}
                  className="btn-primary px-6 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50">
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>

            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="https://console.firebase.google.com/project/unicorn-ds-7f831/firestore" target="_blank"
                  className="block px-4 py-3 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-all">
                  Open Firebase Console →
                </a>
                <a href="https://business.revolut.com/merchant" target="_blank"
                  className="block px-4 py-3 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-all">
                  Open Revolut Merchant →
                </a>
                <a href="https://vercel.com/dashboard" target="_blank"
                  className="block px-4 py-3 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-all">
                  Open Vercel Dashboard →
                </a>
                <a href="https://chrome.google.com/webstore/devconsole" target="_blank"
                  className="block px-4 py-3 border border-[#3d3580] rounded-lg text-sm text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] transition-all">
                  Chrome Web Store Console →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab — System Monitoring */}
        {tab === "health" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">System Health</h2>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      const token = await getToken();
                      const res = await fetch("/api/test-telegram", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      if (data.ok) {
                        alert("✅ Telegram is working! Check your Telegram group.");
                      } else {
                        alert(`❌ Telegram failed:\n${data.error || "Unknown error"}\n\nToken set: ${data.has_token}\nChat ID set: ${data.has_chat_id}`);
                      }
                    } catch (e) { alert("❌ Network error: " + e); }
                  }}
                  className="px-5 py-2.5 bg-[#0088cc] text-white rounded-lg text-sm font-bold hover:bg-[#006daa] transition-all"
                >
                  📱 Test Telegram
                </button>
                <button
                  onClick={async () => {
                  setHealthLoading(true);
                  try {
                    const token = await getToken();
                    const res = await fetch("/api/admin/health", { headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) setHealth(await res.json());
                  } catch (e) { console.error(e); }
                  setHealthLoading(false);
                }}
                disabled={healthLoading}
                className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all"
              >
                {healthLoading ? "⏳ Checking..." : "🔄 Run Health Check"}
              </button>
              </div>
            </div>

            {!health && !healthLoading && (
              <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-10 text-center">
                <p className="text-4xl mb-3">🏥</p>
                <p className="text-[#a5a0cc]">Click &quot;Run Health Check&quot; to scan all services</p>
              </div>
            )}

            {health && (
              <>
                {/* Overall Status */}
                <div className={`rounded-xl p-5 border ${
                  health.status === "healthy" ? "bg-[#059669]/10 border-[#059669]/30" :
                  health.status === "degraded" ? "bg-[#D97706]/10 border-[#D97706]/30" :
                  "bg-[#DC2626]/10 border-[#DC2626]/30"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {health.status === "healthy" ? "✅" : health.status === "degraded" ? "⚠️" : "❌"}
                      </span>
                      <div>
                        <div className="text-lg font-bold text-white capitalize">{health.status}</div>
                        <div className="text-xs text-[#a5a0cc]">{health.timestamp} · {health.totalLatency}ms</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#a5a0cc]">{health.checks?.length || 0} services checked</div>
                  </div>
                </div>

                {/* Individual Checks */}
                <div className="space-y-3">
                  {health.checks?.map((c: any, i: number) => (
                    <div key={i} className={`bg-[#1E1B4B]/50 border rounded-xl p-4 ${
                      c.status === "ok" ? "border-[#059669]/30" :
                      c.status === "warning" ? "border-[#D97706]/30" :
                      "border-[#DC2626]/30"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">
                            {c.status === "ok" ? "✅" : c.status === "warning" ? "⚠️" : "❌"}
                          </span>
                          <div>
                            <div className="font-bold text-white text-sm">{c.name}</div>
                            <div className="text-sm text-[#a5a0cc] mt-0.5">{c.message}</div>
                            {c.details && (
                              <details className="mt-2">
                                <summary className="text-xs text-[#7C3AED] cursor-pointer hover:text-[#A78BFA]">Show details</summary>
                                <pre className="mt-2 text-xs text-[#a5a0cc] bg-black/30 rounded-lg p-3 overflow-x-auto max-h-48">
                                  {JSON.stringify(c.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                        {c.latency && (
                          <span className="text-xs text-[#a5a0cc] bg-[#1E1B4B] px-2 py-1 rounded">{c.latency}ms</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-5">
                  <h3 className="font-bold text-white mb-3">Quick Links</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <a href="https://console.firebase.google.com/project/unicorn-ds-7f831/firestore" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      🔥 Firestore
                    </a>
                    <a href="https://console.firebase.google.com/project/unicorn-ds-7f831/functions" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      ⚡ Cloud Functions
                    </a>
                    <a href="https://app.brevo.com" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      📧 Brevo Email
                    </a>
                    <a href="https://vercel.com/dashboard" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      🌐 Vercel
                    </a>
                    <a href="https://search.google.com/search-console" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      📊 Search Console
                    </a>
                    <a href="https://analytics.google.com" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      📈 Google Analytics
                    </a>
                    <a href="https://www.youtube.com/channel/UCqyAi7iJ8gykR0r1JuG8uLQ" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      🎥 YouTube
                    </a>
                    <a href="https://console.firebase.google.com/project/unicorn-ds-7f831/functions/logs" target="_blank"
                      className="px-4 py-3 border border-[#3d3580] rounded-lg text-xs text-[#a5a0cc] hover:text-white hover:border-[#7C3AED] text-center transition-all">
                      📋 Function Logs
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
