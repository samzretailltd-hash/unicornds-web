"use client";
import { useState } from "react";

export default function AffiliatePage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [audience, setAudience] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !plan.trim()) { setError("Please fill in all required fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), website: website.trim(), audience: audience.trim(), plan: plan.trim() }),
      });
      if (res.ok) { setSuccess(true); }
      else { setError("Failed to submit. Please try again or email affiliate@unicornds.io"); }
    } catch { setError("Failed to submit. Please email affiliate@unicornds.io"); }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-xs text-[#F59E0B] font-semibold uppercase tracking-wider mb-4">Affiliate Program</span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold mb-4">Earn 30% Recurring Commission</h1>
          <p className="text-lg text-[#a5a0cc] max-w-2xl mx-auto">Recommend UnicornDS to other eBay sellers and earn 30% of their subscription — every month, for as long as they stay subscribed.</p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { step: "1", title: "Apply", desc: "Fill out the application form below. We review and approve within 24 hours." },
            { step: "2", title: "Share", desc: "Get your unique referral link. Share it on YouTube, social media, blog — anywhere." },
            { step: "3", title: "Earn", desc: "Earn 30% of every subscription payment from your referrals. Paid monthly." },
          ].map(s => (
            <div key={s.step} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.step}</div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[#a5a0cc]">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Earnings examples */}
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-6 text-center">What You Could Earn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { referrals: 5, plan: "Starter", monthly: "£29.99", earning: "£44.99" },
              { referrals: 10, plan: "Growth", monthly: "£59.99", earning: "£179.97" },
              { referrals: 25, plan: "Mixed", monthly: "avg £49.99", earning: "£374.93" },
            ].map(e => (
              <div key={e.referrals} className="text-center">
                <div className="text-3xl font-extrabold text-[#F59E0B] mb-1">{e.earning}<span className="text-sm text-[#a5a0cc]">/mo</span></div>
                <p className="text-sm text-[#a5a0cc]">{e.referrals} referrals on {e.plan}</p>
                <p className="text-xs text-[#6b6899]">({e.monthly} x {e.referrals} x 30%)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-4">Programme Details</h2>
          <div className="space-y-3 text-sm text-[#c8c4e0]">
            <p><strong className="text-white">Commission:</strong> 30% recurring on all subscription payments from your referrals</p>
            <p><strong className="text-white">Cookie duration:</strong> 90 days — if someone clicks your link and signs up within 90 days, you get credit</p>
            <p><strong className="text-white">Payment:</strong> Monthly via bank transfer, minimum payout £50</p>
            <p><strong className="text-white">Tracking:</strong> Unique referral link with monthly performance reports</p>
            <p><strong className="text-white">Who can join:</strong> Anyone — eBay sellers, YouTubers, bloggers, social media influencers</p>
            <p><strong className="text-white">Restrictions:</strong> No self-referrals, no paid ads bidding on UnicornDS brand terms, no spam</p>
          </div>
        </div>

        {/* CTA + Application Form */}
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-4">Ready to Start Earning?</h2>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-white font-bold text-lg mb-2">Application Submitted!</h3>
              <p className="text-sm text-[#a5a0cc]">We&apos;ll review your application and get back to you within 24 hours at the email you provided. Thank you!</p>
            </div>
          ) : !showForm ? (
            <>
              <p className="text-[#a5a0cc] mb-6">Apply to join our affiliate programme. We review applications within 24 hours.</p>
              <button onClick={() => setShowForm(true)} className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-bold text-sm hover:brightness-110 transition-all">
                Apply Now &rarr;
              </button>
              <p className="text-xs text-[#6b6899] mt-4">Or email us at <a href="mailto:affiliate@unicornds.io" className="text-[#A78BFA] underline">affiliate@unicornds.io</a></p>
            </>
          ) : (
            <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 max-w-md mx-auto text-left">
              <h3 className="text-white font-bold text-lg mb-4 text-center">Affiliate Application</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Full Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Website / YouTube / Social Media</label>
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="https://your-website.com" />
                </div>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Audience Size (approx)</label>
                  <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="e.g. 5,000 YouTube subscribers" />
                </div>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">How will you promote UnicornDS? *</label>
                  <select value={plan} onChange={e => setPlan(e.target.value)} required
                    className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none">
                    <option value="">Select an option</option>
                    <option value="youtube">YouTube videos</option>
                    <option value="blog">Blog / Website</option>
                    <option value="social">Social media (Facebook, TikTok, Instagram)</option>
                    <option value="training">Training courses / Community</option>
                    <option value="email">Email list</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
              <p className="text-xs text-[#6b6899] mt-4 text-center">Or email <a href="mailto:affiliate@unicornds.io" className="text-[#A78BFA] underline">affiliate@unicornds.io</a></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
