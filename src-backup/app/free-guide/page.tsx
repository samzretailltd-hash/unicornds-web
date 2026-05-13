'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export default function FreeGuidePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Track download (fire-and-forget)
    try {
      await fetch('/api/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'free-guide' }),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
    // Auto-download PDF
    window.open('/UnicornDS_eBay_Starter_Kit_2026.pdf', '_blank');
  };

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="hero-glow" />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT - Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-xs text-[#FBBF24] font-semibold uppercase tracking-wider mb-6 badge-float">
              Free Download
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold leading-[1.1] mb-6">
              eBay Dropshipping<br />
              <span className="text-gradient-animated">Starter Kit 2026</span>
            </h1>
            <p className="text-lg text-[#a5a0cc] mb-8 leading-relaxed">
              Everything you need to start a profitable eBay dropshipping business. 20 chapters covering product research, VERO protection, AI listing, pricing formulas, and scaling strategies.
            </p>

            <div className="space-y-4 mb-8">
              {[
                '20 chapters — from zero to scaled business',
                'Amazon Arbitrage + AliExpress strategies',
                'Updated shipping times (UK 4-6 days)',
                'VERO protection — 3,390 brands covered',
                'Pricing formula with worked examples',
                'Daily routine for consistent sales',
                'Tool recommendations & plan guide',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#10B981] mt-0.5 text-lg">✓</span>
                  <span className="text-[#e0d8ff] text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Form */}
          <div className="glass-card rounded-2xl p-8 pulse-glow">
            {!submitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">📘</div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-2">
                    Get Your Free Copy
                  </h2>
                  <p className="text-sm text-[#a5a0cc]">
                    Enter your email and download instantly. No spam, ever.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0f0e1a] border border-[#3d3580] text-white placeholder-[#6b6899] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {loading ? 'Preparing...' : 'Download Free Guide →'}
                  </button>
                  <p className="text-[10px] text-[#6b6899] text-center">
                    By downloading, you agree to receive occasional updates from UnicornDS. Unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-3">
                  Your guide is downloading!
                </h2>
                <p className="text-sm text-[#a5a0cc] mb-6">
                  If the download didn't start,{' '}
                  <a href="/UnicornDS_eBay_Starter_Kit_2026.pdf" className="text-[#7C3AED] underline" target="_blank">
                    click here
                  </a>
                </p>
                <div className="border-t border-[#3d3580] pt-6 mt-6">
                  <p className="text-sm text-[#a5a0cc] mb-4">Ready to put it into practice?</p>
                  <Link href="/download" className="btn-primary px-8 py-3 rounded-xl text-sm font-bold inline-block">
                    Start 14-Day Free Trial →
                  </Link>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[#3d3580]/30">
              <span className="text-[10px] text-[#6b6899]">🔒 No spam</span>
              <span className="text-[10px] text-[#6b6899]">📄 PDF format</span>
              <span className="text-[10px] text-[#6b6899]">⚡ Instant download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
