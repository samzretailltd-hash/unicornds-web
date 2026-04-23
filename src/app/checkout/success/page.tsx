"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { window.location.href = "/download"; clearInterval(timer); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#10B981]/30 rounded-xl p-10 w-full max-w-md text-center">
        <span className="text-6xl mb-4 block">🎉</span>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-2">
          Welcome to UnicornDS!
        </h1>
        <p className="text-[#a5a0cc] mb-6">
          Your subscription is active. Your 14-day free trial has started — you won&apos;t be charged until day 15.
        </p>
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 mb-6">
          <p className="text-[#34D399] text-sm font-semibold">Your plan is now active in the extension. Just log in and start listing!</p>
        </div>
        <Link href="/download" className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold inline-block">
          Download Extension
        </Link>
        <p className="text-xs text-[#6b6899] mt-4">Redirecting in {countdown}s...</p>
      </div>
    </div>
  );
}
