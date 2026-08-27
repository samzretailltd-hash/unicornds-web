"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [inactiveMsg, setInactiveMsg] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reason") === "inactive") setInactiveMsg(true);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInactiveMsg(false);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { code?: string }).code;
      if (msg === "auth/user-not-found") setError("No account found with this email");
      else if (msg === "auth/wrong-password") setError("Incorrect password");
      else if (msg === "auth/invalid-credential") setError("Invalid email or password");
      else setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) { setError("Enter your email first"); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch { setError("Could not send reset email. Check your email address."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-1">Welcome Back</h1>
          <p className="text-sm text-[#a5a0cc]">Sign in to your UnicornDS account</p>
        </div>
        {inactiveMsg && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-300 text-center">
            🔒 You were signed out due to inactivity. Please sign in again.
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {resetSent && <p className="text-green-400 text-sm">Password reset email sent! Check your inbox.</p>}
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-bold text-sm disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <button onClick={handleReset} className="text-xs text-[#A78BFA] hover:underline">Forgot password?</button>
          <p className="text-xs text-[#6b6899]">Don&apos;t have an account? <Link href="/signup" className="text-[#A78BFA] hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-20"><p className="text-[#a5a0cc]">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
