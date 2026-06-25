"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AffiliateLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const check = await fetch("/api/affiliate/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await check.json();
      if (!result.approved) {
        setError("This email is not an approved affiliate. If you are a customer, please use the normal login.");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/affiliate/dashboard");
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Wrong email or password. If you have not set up your login yet, use Set up login below.");
      } else {
        setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-[#0f0e1a]">
      <div className="w-full max-w-md bg-[#1E1B4B]/50 border border-[#3d3580] rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold text-white text-center mb-1">Affiliate Login</h1>
        <p className="text-sm text-[#a5a0cc] text-center mb-6">Sign in to see your referrals and earnings.</p>
        <label className="block text-sm text-[#a5a0cc] mb-1">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />
        <label className="block text-sm text-[#a5a0cc] mb-1">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 rounded-lg font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In to Affiliate Dashboard"}
        </button>
        <p className="text-sm text-[#a5a0cc] text-center mt-4">
          First time? <Link href="/affiliate/signup" className="text-[#A78BFA] hover:text-white">Set up your login</Link>
        </p>
        <p className="text-xs text-[#6b6899] text-center mt-2">
          Not an affiliate yet? <Link href="/affiliate" className="text-[#A78BFA] hover:text-white">Apply here</Link>
        </p>
      </div>
    </div>
  );
}
