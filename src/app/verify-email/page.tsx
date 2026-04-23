"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, sendEmailVerification, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u?.emailVerified) router.push("/pricing");
    });
  }, [router]);

  const handleResend = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setResent(true);
      setError("");
      setTimeout(() => setResent(false), 30000);
    } catch {
      setError("Please wait a minute before requesting another email.");
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    setChecking(true);
    try {
      await user.reload();
      const refreshed = auth.currentUser;
      if (refreshed?.emailVerified) {
        router.push("/pricing");
      } else {
        setError("Email not verified yet. Please check your inbox and click the verification link.");
      }
    } catch {
      setError("Could not check verification status. Please try again.");
    }
    setChecking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-[#a5a0cc]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a5a0cc] mb-4">Please sign in first.</p>
          <Link href="/login" className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">Log In</Link>
        </div>
      </div>
    );
  }

  if (user.emailVerified) {
    router.push("/pricing");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-md text-center">
        <span className="text-5xl mb-4 block">📧</span>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-2">
          Verify Your Email
        </h1>
        <p className="text-sm text-[#a5a0cc] mb-2">
          We sent a verification link to:
        </p>
        <p className="text-[#A78BFA] font-semibold text-sm mb-6">
          {user.email}
        </p>

        <div className="bg-[#0f0e1a] border border-[#3d3580] rounded-lg p-4 mb-6 text-left">
          <p className="text-xs text-[#a5a0cc] leading-relaxed">
            <strong className="text-white">Steps:</strong><br />
            1. Open your email inbox<br />
            2. Find the email from <strong>noreply@unicorn-ds-7f831.firebaseapp.com</strong><br />
            3. Click the verification link<br />
            4. Come back here and click the button below
          </p>
          <p className="text-xs text-[#F59E0B] mt-3">
            Check your <strong>spam/junk folder</strong> if you don&apos;t see it.
          </p>
        </div>

        <button
          onClick={handleCheckVerification}
          disabled={checking}
          className="w-full btn-primary py-3 rounded-xl text-sm font-bold mb-3 disabled:opacity-50"
        >
          {checking ? "Checking..." : "I've Verified My Email ✓"}
        </button>

        <button
          onClick={handleResend}
          disabled={resent}
          className="w-full py-3 rounded-xl text-sm font-semibold border border-[#3d3580] text-[#a5a0cc] hover:border-[#7C3AED] hover:text-white transition-all disabled:opacity-50"
        >
          {resent ? "Email Sent! Check your inbox" : "Resend Verification Email"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        <p className="mt-6 text-xs text-[#6b6899]">
          Wrong email? <Link href="/signup" className="text-[#A78BFA] hover:underline">Sign up again</Link> with a different email.
        </p>
      </div>
    </div>
  );
}
