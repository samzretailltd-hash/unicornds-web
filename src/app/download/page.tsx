"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DownloadPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && !u.emailVerified) router.push("/verify-email");
    });
  }, [router]);

  const handleDownload = async () => {
    if (!user || downloading) return;
    setDownloading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        alert("Download failed. Please try logging in again.");
        setDownloading(false);
        return;
      }
      const data = await res.json();
      const a = document.createElement("a");
      a.href = data.url;
      a.download = data.filename || "UnicornDS.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloaded(true);
      setStep(1);
    } catch (e) {
      alert("Download failed. Please refresh and try again.");
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-[#a5a0cc]">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider mb-4">
            7-Day Trial for £1
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Install UnicornDS
          </h1>
          <p className="text-[#a5a0cc] mb-8 leading-relaxed">
            Create a free account to start your 7-day £1 trial. £1 charged today, cancel anytime.
          </p>
          <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 mb-6">
            <img src="/logo.png" alt="UnicornDS" className="w-12 h-12 mx-auto mb-4 rounded-lg" />
            <h3 className="text-lg font-bold text-white mb-2">Your Plan Includes</h3>
            <div className="text-left max-w-xs mx-auto space-y-2 text-sm text-[#a5a0cc]">
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Full access for 7 days</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> AI Title Builder (GPT-4o)</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Product Hunter (unlimited)</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Order Manager + Bulk Fulfill</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Competitor Scanner (3/day)</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Stock Checker (10/day)</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> Bulk Lister (1 tab)</p>
              <p className="flex gap-2"><span className="text-[#10B981]">✓</span> VERO Protection (3,629 brands)</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold">
              Start 7-Day Trial for £1
            </Link>
            <Link href="/login" className="px-8 py-3.5 rounded-xl text-base font-semibold border border-[#3d3580] text-[#e0d8ff] hover:border-[#7C3AED] hover:text-white transition-all">
              Already Have an Account? Log In
            </Link>
          </div>
          <p className="mt-6 text-xs text-[#6b6899]">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-[#A78BFA] hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-[#A78BFA] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    );
  }

  // Logged in — show install steps
  const steps = [
    {
      num: 1,
      title: "Download the Extension",
      desc: "Click the button below to download UnicornDS as a ZIP file.",
      action: (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <span className="text-xl">{downloading ? "⏳" : "⬇️"}</span>
          {downloading ? "Downloading..." : "Download UnicornDS v7.21.0"}
        </button>
      ),
    },
    {
      num: 2,
      title: "Unzip the File",
      desc: 'Find the downloaded ZIP file in your Downloads folder. Right-click and select "Extract All" (Windows) or double-click to unzip (Mac). You\'ll get a folder with the extension files.',
      action: (
        <button onClick={() => setStep(2)} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">
          Done — Next Step →
        </button>
      ),
    },
    {
      num: 3,
      title: "Open Chrome Extensions",
      desc: "Open Chrome and type this in the address bar:",
      extra: (
        <div className="bg-[#0f0e1a] border border-[#3d3580] rounded-lg p-4 my-3">
          <code className="text-[#F59E0B] text-lg font-mono select-all">chrome://extensions</code>
        </div>
      ),
      action: (
        <button onClick={() => setStep(3)} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">
          Done — Next Step →
        </button>
      ),
    },
    {
      num: 4,
      title: "Enable Developer Mode",
      desc: 'In the top-right corner of the Extensions page, toggle ON the "Developer mode" switch.',
      action: (
        <button onClick={() => setStep(4)} className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">
          Done — Next Step →
        </button>
      ),
    },
    {
      num: 5,
      title: "Load the Extension",
      desc: 'Click "Load unpacked" in the top-left. Navigate to the UnicornDS folder you unzipped and select it. The extension icon will appear in your Chrome toolbar!',
      action: null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#10B981]/12 border border-[#10B981]/25 text-xs text-[#34D399] font-semibold uppercase tracking-wider mb-4">
            Welcome, {user.displayName || user.email?.split("@")[0] || "Seller"}
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Install UnicornDS
          </h1>
          <p className="text-[#a5a0cc] max-w-xl mx-auto">
            Follow these steps to install the extension. Works on Chrome, Edge, Brave, and any Chromium browser.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`bg-[#1E1B4B]/50 border rounded-xl p-6 transition-all ${
                i <= step ? "border-[#7C3AED] opacity-100" : "border-[#3d3580]/30 opacity-40 pointer-events-none"
              } ${i < step ? "border-[#10B981]/50" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    i < step
                      ? "bg-[#10B981] text-white"
                      : i === step
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#2d2766] text-[#6b6899]"
                  }`}
                >
                  {i < step ? "✓" : s.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-[#a5a0cc] leading-relaxed">{s.desc}</p>
                  {(s as any).extra}
                  {i === step && s.action && <div className="mt-4">{s.action}</div>}
                  {i === steps.length - 1 && i <= step && (
                    <div className="mt-6 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4">
                      <p className="text-[#34D399] font-bold text-sm mb-1">🎉 You're all set!</p>
                      <p className="text-sm text-[#a5a0cc]">
                        Click the UnicornDS icon in your toolbar to get started. You're already logged in — start listing on eBay!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's new in v7.21 */}
        <div className="mt-8 bg-gradient-to-r from-[#F59E0B]/10 to-[#7C3AED]/10 border border-[#F59E0B]/30 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-3">✨ What's new in v7.21.0</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#a5a0cc]">
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> Walmart product variations (size, colour, style)</p>
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> Strict Walmart-only sourcing (skips 3rd-party sellers)</p>
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> Multi-currency support (€, $, CHF, C$)</p>
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> Native-language listings (DE, FR & more)</p>
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> Delivered orders show correctly</p>
            <p className="flex gap-2"><span className="text-[#F59E0B]">★</span> All orders import + accurate earnings</p>
          </div>
        </div>

        {/* Browser support */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#6b6899] mb-3">Works on all Chromium browsers</p>
          <div className="flex justify-center gap-6 text-[#a5a0cc]">
            <div className="flex flex-col items-center gap-1"><span className="text-2xl">🌐</span><span className="text-xs">Chrome</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-2xl">🔵</span><span className="text-xs">Edge</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-2xl">🦁</span><span className="text-xs">Brave</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-2xl">🔴</span><span className="text-xs">Opera</span></div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 space-y-3">
          <h3 className="text-lg font-bold text-white text-center mb-4">Common Questions</h3>
          <details className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl group">
            <summary className="p-4 cursor-pointer font-semibold text-white text-sm flex justify-between items-center list-none">
              Is it safe to install extensions this way?
              <span className="text-[#A78BFA] text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-[#a5a0cc]">
              Yes! This is the standard way developers test Chrome extensions. It's the same code that will be on the Chrome Web Store — we're just waiting for Google's review process. Your data is protected by Firebase authentication.
            </p>
          </details>
          <details className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl group">
            <summary className="p-4 cursor-pointer font-semibold text-white text-sm flex justify-between items-center list-none">
              Will I get updates automatically?
              <span className="text-[#A78BFA] text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-[#a5a0cc]">
              With direct install, you'll need to download new versions from this page. Once we're approved on the Chrome Web Store, you can switch to the store version for automatic updates. We'll notify you by email when that happens.
            </p>
          </details>
          <details className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl group">
            <summary className="p-4 cursor-pointer font-semibold text-white text-sm flex justify-between items-center list-none">
              Chrome shows a "Developer mode extensions" warning — is that normal?
              <span className="text-[#A78BFA] text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-[#a5a0cc]">
              Yes, Chrome shows this for any extension loaded in Developer mode. It's just a reminder, not a security issue. You can dismiss it. This goes away once you switch to the Chrome Web Store version.
            </p>
          </details>
        </div>

        {/* Onboarding CTA */}
        <div className="bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/30 rounded-xl p-6 mb-6 text-center mt-8">
          <p className="text-lg font-bold text-white mb-1">🎯 Need Help Getting Started?</p>
          <p className="text-sm text-[#a5a0cc] mb-4">
            Book a free 30-min onboarding call with our founder. We will walk you through everything — installation, settings, your first listing.
          </p>
          <a
            href="https://calendly.com/1stunicornltd/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-sm font-bold transition-colors"
          >
            Book Free Onboarding Call
          </a>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#6b6899]">
            Need help?{" "}
            <Link href="/support" className="text-[#A78BFA] hover:underline">Contact support</Link>{" "}
            or email{" "}
            <a href="mailto:support@unicornds.io" className="text-[#A78BFA] hover:underline">support@unicornds.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
