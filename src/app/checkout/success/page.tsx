"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const [countdown, setCountdown] = useState(5);
  const params = useSearchParams();

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
          You&apos;re In!
        </h1>
        <p className="text-[#a5a0cc] mb-6">
          Your card has been verified and your account is now active. No charges have been made.
        </p>
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 mb-6">
          <p className="text-[#34D399] text-sm font-semibold">
            ✅ 100 free listings ready to use<br />
            ✅ AI titles, Product Hunter, VERO protection included<br />
            ✅ Download the extension and start listing!
          </p>
        </div>
        <Link href="/download" className="btn-primary px-8 py-3.5 rounded-xl text-base font-bold inline-block">
          Download Extension
        </Link>
        <p className="text-xs text-[#6b6899] mt-4">Redirecting in {countdown}s...</p>
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
