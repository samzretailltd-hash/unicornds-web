"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "United Kingdom", "United States", "Pakistan", "Germany", "France", "Spain", "Italy",
  "Australia", "Canada", "India", "Netherlands", "Belgium", "Ireland", "Switzerland",
  "Austria", "Sweden", "Norway", "Denmark", "Poland", "Turkey", "UAE", "Saudi Arabia",
  "South Africa", "Brazil", "Mexico", "Philippines", "Nigeria", "Egypt", "Other",
];

const PHONE_CODES: Record<string, string> = {
  "United Kingdom": "+44", "United States": "+1", "Pakistan": "+92", "Germany": "+49",
  "France": "+33", "Spain": "+34", "Italy": "+39", "Australia": "+61", "Canada": "+1",
  "India": "+91", "Netherlands": "+31", "Belgium": "+32", "Ireland": "+353", "Switzerland": "+41",
  "Austria": "+43", "Sweden": "+46", "Norway": "+47", "Denmark": "+45", "Poland": "+48",
  "Turkey": "+90", "UAE": "+971", "Saudi Arabia": "+966", "South Africa": "+27",
  "Brazil": "+55", "Mexico": "+52", "Philippines": "+63", "Nigeria": "+234", "Egypt": "+20", "Other": "+",
};

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("+44");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.startsWith("America/New_York") || tz.startsWith("America/Chicago") || tz.startsWith("America/Denver") || tz.startsWith("America/Los_Angeles")) { setCountry("United States"); setPhoneCode("+1"); }
      else if (tz.startsWith("Europe/Berlin")) { setCountry("Germany"); setPhoneCode("+49"); }
      else if (tz.startsWith("Europe/Paris")) { setCountry("France"); setPhoneCode("+33"); }
      else if (tz.startsWith("Europe/Madrid")) { setCountry("Spain"); setPhoneCode("+34"); }
      else if (tz.startsWith("Asia/Karachi")) { setCountry("Pakistan"); setPhoneCode("+92"); }
      else if (tz.startsWith("Australia/")) { setCountry("Australia"); setPhoneCode("+61"); }
      else if (tz.startsWith("Asia/Kolkata")) { setCountry("India"); setPhoneCode("+91"); }
      else { setCountry("United Kingdom"); setPhoneCode("+44"); }
    } catch { setCountry("United Kingdom"); }
  }, []);

  const handleCountryChange = (c: string) => { setCountry(c); setPhoneCode(PHONE_CODES[c] || "+"); };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) { setError("Please enter your full name"); return; }
    if (!phone.trim() || phone.length < 6) { setError("Please enter a valid mobile number"); return; }
    if (!country) { setError("Please select your country"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (!agreed) { setError("Please agree to the Terms and Privacy Policy"); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      await sendEmailVerification(cred.user);
      const token = await cred.user.getIdToken();
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: `${phoneCode}${phone.trim()}`,
          country,
          ref: new URLSearchParams(window.location.search).get("ref") || null,
        }),
      });
      router.push("/verify-phone");
    } catch (err: unknown) {
      const msg = (err as { code?: string }).code;
      if (msg === "auth/email-already-in-use") setError("An account with this email already exists. Try signing in.");
      else if (msg === "auth/weak-password") setError("Password is too weak. Use at least 6 characters.");
      else setError("Signup failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-1">Create Account</h1>
          <p className="text-sm text-[#a5a0cc]">Create your account to get started</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-3.5">
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="John Smith" />
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Country *</label>
            <select value={country} onChange={e => handleCountryChange(e.target.value)} required
              className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none">
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Mobile Number *</label>
            <div className="flex gap-2">
              <input type="text" value={phoneCode} readOnly
                className="w-16 px-2 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-[#a5a0cc] text-sm text-center outline-none" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} required
                className="flex-1 px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="7123456789" />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Password *</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="text-xs text-[#a5a0cc] mb-1 block">Confirm Password *</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full px-4 py-2.5 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none" placeholder="••••••••" />
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#7C3AED]" />
            <span className="text-xs text-[#a5a0cc]">I agree to the <Link href="/terms" className="text-[#A78BFA] underline">Terms</Link> and <Link href="/privacy" className="text-[#A78BFA] underline">Privacy Policy</Link></span>
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-bold text-sm disabled:opacity-50">
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#6b6899]">Already have an account? <Link href="/login" className="text-[#A78BFA] hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
