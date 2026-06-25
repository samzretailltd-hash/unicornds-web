"use client";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AffiliateSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      // 1) Check this email is an approved affiliate
      const check = await fetch("/api/affiliate/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await check.json();

      if (!result.approved) {
        setError("This email is not an approved affiliate. Please apply at /affiliate first, or wait for approval.");
        setLoading(false);
        return;
      }

      // 2) Create the login account (no phone verification, no plan, no purchase)
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      // 3) Straight to the affiliate dashboard
      router.push("/affiliate/dashboard");
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in instead.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-[#0f0e1a]">
      <div className="w-full max-w-md bg-[#1E1B4B]/50 border border-[#3d3580] rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold text-white text-center mb-1">Affiliate Sign Up</h1>
        <p className="text-sm text-[#a5a0cc] text-center mb-6">
          Set up your login to access your affiliate dashboard.
        </p>

        <label className="block text-sm text-[#a5a0cc] mb-1">Full Name</label>
        <input value={name} onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />

        <label className="block text-sm text-[#a5a0cc] mb-1">Email (the one you applied with)</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />

        <label className="block text-sm text-[#a5a0cc] mb-1">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />

        <label className="block text-sm text-[#a5a0cc] mb-1">Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded-lg bg-[#0f0e1a] border border-[#3d3580] text-white text-sm" />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 rounded-lg font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50">
          {loading ? "Setting up..." : "Create Affiliate Login"}
        </button>

        <p className="text-sm text-[#a5a0cc] text-center mt-4">
          Already have a login? <Link href="/login" className="text-[#A78BFA] hover:text-white">Log in</Link>
        </p>
        <p className="text-xs text-[#6b6899] text-center mt-2">
          Not an affiliate yet? <Link href="/affiliate" className="text-[#A78BFA] hover:text-white">Apply here</Link>
        </p>
      </div>
    </div>
  );
}
