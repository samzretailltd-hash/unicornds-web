"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

interface Invoice {
  id: string;
  number: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string;
  hosted_invoice_url: string;
  period_start: number;
  period_end: number;
  description: string;
}

interface UpcomingInvoice {
  amount_due: number;
  currency: string;
  next_payment_attempt: number | null;
  period_end: number;
}

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingInvoice | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      await loadData(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function loadData(u: User) {
    try {
      const token = await u.getIdToken();
      const res = await fetch("/api/stripe/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
        setUpcoming(data.upcoming || null);
        setProfile(data.profile || null);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to load invoices");
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function openPortal() {
    if (!user) return;
    setPortalLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ return_url: window.location.href }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to open billing portal");
        setPortalLoading(false);
      }
    } catch (e: any) {
      setError(e.message);
      setPortalLoading(false);
    }
  }

  function formatCurrency(amount: number, currency = "gbp") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function statusBadge(status: string) {
    const styles: Record<string, string> = {
      paid: "bg-green-500/20 text-green-400",
      open: "bg-yellow-500/20 text-yellow-400",
      void: "bg-gray-500/20 text-gray-400",
      uncollectible: "bg-red-500/20 text-red-400",
      draft: "bg-blue-500/20 text-blue-400",
    };
    return styles[status] || "bg-gray-500/20 text-gray-400";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
        <div className="text-[#a5a0cc]">Loading billing information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0e1a] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/dashboard" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">← Back to dashboard</Link>
            <h1 className="text-3xl font-bold text-white mt-2">Billing &amp; Invoices</h1>
            <p className="text-[#a5a0cc] mt-1">Manage your subscription and download invoices</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-[#1E1B4B] border border-[#3d3580]/40 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Current Plan</h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#7C3AED]/20 text-[#7C3AED]">
                  {(profile?.tier || "FREE").toUpperCase()}
                </span>
                {profile?.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    profile.status === "active" ? "bg-green-500/20 text-green-400" :
                    profile.status === "trialing" ? "bg-blue-500/20 text-blue-400" :
                    profile.status === "payment_failed" ? "bg-red-500/20 text-red-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {profile.status.toUpperCase()}
                  </span>
                )}
              </div>
              {profile?.billing_period_end && (
                <p className="text-[#a5a0cc] text-sm mt-3">
                  {profile.status === "trialing" ? "Trial ends:" : "Next billing date:"}{" "}
                  <span className="text-white font-medium">
                    {new Date(profile.billing_period_end).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </span>
                </p>
              )}
              {profile?.tokensTotal !== undefined && (
                <p className="text-[#a5a0cc] text-sm mt-1">
                  Listings used: <span className="text-white font-medium">{profile.tokensUsed || 0} / {profile.tokensTotal}</span>
                </p>
              )}
            </div>
            <button
              onClick={openPortal}
              disabled={portalLoading || !profile?.stripe_customer_id}
              className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#9333EA] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition"
            >
              {portalLoading ? "Opening..." : "💳 Manage Subscription"}
            </button>
          </div>

          {!profile?.stripe_customer_id && (
            <div className="bg-[#0f0e1a] rounded-lg p-4 mt-4 text-[#a5a0cc] text-sm">
              No active subscription. <Link href="/pricing" className="text-[#7C3AED] hover:underline">Choose a plan</Link>
            </div>
          )}
        </div>

        {/* Upcoming Invoice */}
        {upcoming && (
          <div className="bg-[#1E1B4B] border border-[#F59E0B]/30 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-3">📅 Upcoming Charge</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(upcoming.amount_due, upcoming.currency)}
                </p>
                {upcoming.next_payment_attempt && (
                  <p className="text-[#a5a0cc] text-sm mt-1">
                    on {formatDate(upcoming.next_payment_attempt)}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
                PENDING
              </span>
            </div>
          </div>
        )}

        {/* Invoice History */}
        <div className="bg-[#1E1B4B] border border-[#3d3580]/40 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Invoice History</h2>

          {invoices.length === 0 ? (
            <p className="text-[#a5a0cc] text-center py-8">No invoices yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3d3580]/40 text-[#a5a0cc] text-xs uppercase">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Invoice #</th>
                    <th className="text-left p-3 font-medium">Period</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-[#3d3580]/20 hover:bg-[#2d2766]/30">
                      <td className="p-3 text-white">{formatDate(inv.created)}</td>
                      <td className="p-3 text-[#a5a0cc] font-mono text-xs">{inv.number || inv.id.slice(0, 14)}</td>
                      <td className="p-3 text-[#a5a0cc] text-xs">
                        {formatDate(inv.period_start)} → {formatDate(inv.period_end)}
                      </td>
                      <td className="p-3 text-white font-bold">{formatCurrency(inv.amount_paid || inv.amount_due, inv.currency)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusBadge(inv.status)}`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        {inv.invoice_pdf && (
                          <a
                            href={inv.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#7C3AED]/20 hover:bg-[#7C3AED]/40 text-[#7C3AED] rounded text-xs font-bold"
                          >
                            📥 PDF
                          </a>
                        )}
                        {inv.hosted_invoice_url && (
                          <a
                            href={inv.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#3d3580]/40 hover:bg-[#3d3580]/60 text-white rounded text-xs font-bold"
                          >
                            👁 View
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help footer */}
        <div className="mt-8 text-center text-[#a5a0cc] text-sm">
          Need help with billing?{" "}
          <a href="mailto:support@unicornds.io" className="text-[#7C3AED] hover:underline">
            Email support
          </a>
        </div>
      </div>
    </div>
  );
}
