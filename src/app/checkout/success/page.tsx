"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const [countdown, setCountdown] = useState(8);
  const params = useSearchParams();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { window.location.href = "/book-call"; clearInterval(timer); }
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
          You&apos;re In!
        </h1>
        <p className="text-[#a5a0cc] mb-6">
          Your 7-day trial is active. Just £1 has been charged — your subscription starts after 7 days.
        </p>
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 mb-6">
          <p className="text-[#34D399] text-sm font-semibold">
            ✅ 7-day full access trial active<br />
            ✅ AI titles, Product Hunter, VERO protection included<br />
            ✅ One more step — book your free setup call!
          </p>
        </div>

        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4 mb-5">
          <p className="text-sm text-white font-semibold mb-1">📞 Next: Book Your Free Setup Call</p>
          <p className="text-xs text-[#a5a0cc] mb-3">Every user gets a free 1-on-1 call with the founder to set up everything personally.</p>
          <Link href="/book-call" className="inline-block px-8 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg text-sm font-bold transition-colors">
            Book Your Call Now →
          </Link>
        </div>

        <p className="text-xs text-[#6b6899] mt-4">Redirecting to call booking in {countdown}s...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#a5a0cc]">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
