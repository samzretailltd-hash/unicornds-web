"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Ticket = {
  id: string; subject: string; category: string; status: string;
  createdAt: string; updatedAt: string; lastReplyBy: string;
  messageCount: number; unreadForUser?: boolean;
};
type Msg = { id: string; from: string; authorName: string; body: string; createdAt: string };

const CATEGORIES = [
  { v: "support", l: "General Support" },
  { v: "billing", l: "Billing & Payments" },
  { v: "technical", l: "Technical Problem" },
  { v: "feature", l: "Feature Request" },
  { v: "other", l: "Other" },
];
const STATUS_STYLE: Record<string, string> = {
  open: "bg-[#F59E0B]/15 text-[#F59E0B]",
  pending: "bg-[#7C3AED]/20 text-[#A78BFA]",
  resolved: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-white/10 text-[#a5a0cc]",
};

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "support", message: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    if (!u) { router.push("/login"); return; }
    setUser(u); loadTickets(u); setLoading(false);
  }), [router]);

  async function tok(u?: User | null) { return await (u || auth.currentUser)!.getIdToken(); }

  async function loadTickets(u?: User | null) {
    try {
      const r = await fetch("/api/tickets", { headers: { Authorization: `Bearer ${await tok(u)}` } });
      const d = await r.json();
      if (r.ok) setTickets(d.tickets || []);
    } catch {}
  }

  async function openTicket(id: string) {
    setActive(id); setMessages([]);
    const r = await fetch(`/api/tickets/${id}`, { headers: { Authorization: `Bearer ${await tok()}` } });
    const d = await r.json();
    if (r.ok) setMessages(d.messages || []);
    loadTickets();
  }

  async function createTicket() {
    setErr(""); setBusy(true);
    const r = await fetch("/api/tickets", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await tok()}` },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not create ticket"); return; }
    setForm({ subject: "", category: "support", message: "" }); setCreating(false);
    await loadTickets(); openTicket(d.id);
  }

  async function sendReply() {
    if (!reply.trim() || !active) return;
    setBusy(true);
    const r = await fetch(`/api/tickets/${active}`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await tok()}` },
      body: JSON.stringify({ message: reply }),
    });
    setBusy(false);
    if (r.ok) { setReply(""); openTicket(active); }
  }

  if (loading) return <div className="min-h-screen bg-[#0F0D2E] flex items-center justify-center text-[#a5a0cc]">Loading…</div>;

  return (
    <div className="min-h-screen bg-[#0F0D2E] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-extrabold">Support</h1>
          <Link href="/dashboard" className="text-sm text-[#a5a0cc] hover:text-white">← Dashboard</Link>
        </div>
        <p className="text-[#a5a0cc] mb-6">Raise a ticket and we'll reply here. You'll also get an email when we respond.</p>

        {/* WhatsApp — visible to logged-in customers only */}
        <a href="https://wa.me/447932708798" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-3 mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 hover:bg-emerald-500/15 transition">
          <span className="text-2xl">💬</span>
          <div>
            <div className="font-bold text-emerald-400">Need a quick answer? WhatsApp us</div>
            <div className="text-sm text-[#a5a0cc]">+44 7932 708798 — Mon–Fri, 9am–6pm UK time</div>
          </div>
        </a>

        {!active && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Your tickets</h2>
              <button onClick={() => setCreating(!creating)}
                className="bg-[#F59E0B] text-[#1E1B4B] font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90">
                {creating ? "Cancel" : "+ New ticket"}
              </button>
            </div>

            {creating && (
              <div className="bg-[#1E1B4B]/60 border border-[#3d3580] rounded-xl p-5 mb-6">
                {err && <div className="bg-red-500/15 text-red-300 text-sm p-3 rounded-lg mb-3">{err}</div>}
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subject — e.g. Listing fails on eBay US"
                  className="w-full mb-3 bg-[#0F0D2E] border border-[#3d3580] rounded-lg px-3 py-2 text-sm" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mb-3 bg-[#0F0D2E] border border-[#3d3580] rounded-lg px-3 py-2 text-sm">
                  {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                </select>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe the issue. Include the product URL and what you expected to happen."
                  rows={5} className="w-full mb-3 bg-[#0F0D2E] border border-[#3d3580] rounded-lg px-3 py-2 text-sm" />
                <button onClick={createTicket} disabled={busy}
                  className="bg-[#7C3AED] font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-50">
                  {busy ? "Sending…" : "Submit ticket"}
                </button>
              </div>
            )}

            <div className="space-y-2">
              {tickets.length === 0 && !creating && (
                <div className="text-center py-12 text-[#6b6899] border border-dashed border-[#3d3580] rounded-xl">
                  No tickets yet. Click “New ticket” if you need help.
                </div>
              )}
              {tickets.map((t) => (
                <button key={t.id} onClick={() => openTicket(t.id)}
                  className="w-full text-left bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-4 hover:border-[#7C3AED] transition">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {t.subject}
                        {t.unreadForUser && <span className="ml-2 text-xs bg-[#F59E0B] text-[#1E1B4B] px-2 py-0.5 rounded-full font-bold">NEW REPLY</span>}
                      </div>
                      <div className="text-xs text-[#6b6899] mt-1">
                        #{t.id.slice(0, 6)} · {t.category} · {t.messageCount} message{t.messageCount === 1 ? "" : "s"} · updated {new Date(t.updatedAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[t.status] || ""}`}>{t.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {active && (
          <div>
            <button onClick={() => { setActive(null); loadTickets(); }} className="text-sm text-[#a5a0cc] mb-4 hover:text-white">← All tickets</button>
            <div className="space-y-3 mb-5">
              {messages.map((m) => (
                <div key={m.id} className={`rounded-xl p-4 border ${m.from === "admin" ? "bg-[#7C3AED]/10 border-[#7C3AED]/40" : "bg-[#1E1B4B]/50 border-[#3d3580]"}`}>
                  <div className="text-xs text-[#6b6899] mb-1">
                    {m.from === "admin" ? "🦄 " : ""}{m.authorName} · {new Date(m.createdAt).toLocaleString("en-GB")}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{m.body}</div>
                </div>
              ))}
            </div>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="Write a reply…"
              className="w-full bg-[#0F0D2E] border border-[#3d3580] rounded-lg px-3 py-2 text-sm mb-2" />
            <button onClick={sendReply} disabled={busy || !reply.trim()}
              className="bg-[#F59E0B] text-[#1E1B4B] font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-50">
              {busy ? "Sending…" : "Send reply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
