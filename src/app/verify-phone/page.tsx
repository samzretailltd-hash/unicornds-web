"use client";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, linkWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COUNTRY_CODES = [
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi" },
  { code: "+27", flag: "🇿🇦", name: "S. Africa" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "S. Korea" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
];

export default function VerifyPhonePage() {
  const [phone, setPhone] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [step, setStep] = useState<"loading" | "ready" | "code" | "verified">("loading");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.push("/signup"); return; }

      // Fetch phone from Firestore via API
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.phone_verified) {
          router.push("/verify-email");
          return;
        }
        setPhone(data.phone || "");
        setStep("ready");
      } catch {
        setStep("ready");
      }
    });
    return () => unsub();
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setupRecaptcha = () => {
    if (recaptchaRef.current) return;
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        recaptchaRef.current = null;
      },
    });
  };

  const sendCode = async () => {
    setError("");
    if (!phone || phone.length < 8) {
      setError("Invalid phone number. Please go back and enter a valid number.");
      return;
    }

    setSending(true);
    try {
      setupRecaptcha();
      const user = auth.currentUser;
      if (!user) { router.push("/signup"); return; }

      const confirmation = await linkWithPhoneNumber(user, phone, recaptchaRef.current!);
      confirmationRef.current = confirmation;
      setStep("code");
      setCountdown(60);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      if (firebaseErr.code === "auth/provider-already-linked") {
        // Phone already linked — mark as verified
        await markVerified();
        return;
      }
      if (firebaseErr.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format. Please go back to signup and enter a valid number.");
      } else if (firebaseErr.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (firebaseErr.code === "auth/captcha-check-failed") {
        setError("reCAPTCHA verification failed. Please refresh the page and try again.");
        recaptchaRef.current = null;
      } else {
        setError(firebaseErr.message || "Failed to send code. Please try again.");
      }
    }
    setSending(false);
  };

  const verifyCode = async () => {
    setError("");
    if (code.length !== 6) { setError("Please enter the 6-digit code"); return; }

    setVerifying(true);
    try {
      if (!confirmationRef.current) { setError("Session expired. Please resend the code."); setVerifying(false); return; }
      await confirmationRef.current.confirm(code);
      await markVerified();
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (firebaseErr.code === "auth/invalid-verification-code") {
        setError("Wrong code. Please check your SMS and try again.");
      } else if (firebaseErr.code === "auth/code-expired") {
        setError("Code expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }
    }
    setVerifying(false);
  };

  const markVerified = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken(true);
      await fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone }),
      });
    } catch { /* continue anyway */ }
    setStep("verified");
    setTimeout(() => router.push("/verify-email"), 2000);
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    // Reset recaptcha for resend
    recaptchaRef.current = null;
    await sendCode();
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#a5a0cc]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📱</div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-1">
            {step === "verified" ? "Phone Verified!" : "Verify Your Phone"}
          </h1>
          <p className="text-sm text-[#a5a0cc]">
            {step === "verified"
              ? "Redirecting to email verification..."
              : step === "code"
              ? `We sent a code to ${phone}`
              : "We need to verify your mobile number to activate your account"}
          </p>
        </div>

        {step === "ready" && (
          <div className="space-y-4">
            {!phone ? (
              <>
                <div>
                  <label className="text-xs text-[#a5a0cc] mb-1 block">Select your country &amp; enter mobile number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[130px] px-2 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-sm focus:border-[#7C3AED] outline-none appearance-none cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c, i) => (
                        <option key={`${c.code}-${c.name}-${i}`} value={c.code}>
                          {c.flag} {c.code} {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="7700900000"
                      autoFocus
                      maxLength={12}
                      className="flex-1 px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-lg focus:border-[#7C3AED] outline-none"
                    />
                  </div>
                  <p className="text-xs text-[#6b6899] mt-1">Enter number without leading 0 (e.g. 7700900000 not 07700900000)</p>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                  onClick={async () => {
                    if (!phoneInput || phoneInput.length < 7) { setError("Please enter a valid mobile number"); return; }
                    // Strip leading 0 (users type 07xxx instead of 7xxx)
                    const cleanNumber = phoneInput.replace(/^0+/, "");
                    const formatted = `${countryCode}${cleanNumber}`;
                    setPhone(formatted);
                    // Save phone to profile
                    try {
                      const user = auth.currentUser;
                      if (user) {
                        const token = await user.getIdToken();
                        await fetch("/api/user/profile", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ phone: formatted, fullName: "", country: "", ref: "" }),
                        });
                      }
                    } catch { /* continue */ }
                  }}
                  disabled={!phoneInput || phoneInput.length < 7}
                  className="w-full btn-primary py-3 rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="bg-[#0f0e1a] border border-[#3d3580] rounded-lg p-4 text-center">
                  <div className="text-xs text-[#a5a0cc] mb-1">Sending code to</div>
                  <div className="text-white font-bold text-lg">{phone}</div>
                </div>
                <p className="text-xs text-[#6b6899] text-center">
                  Standard SMS rates may apply. We&apos;ll send a 6-digit code to verify this number.
                </p>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                  onClick={sendCode}
                  disabled={sending || !phone}
                  className="w-full btn-primary py-3 rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Verification Code"}
                </button>
                <p className="text-center text-xs text-[#6b6899]">
                  Wrong number? <button onClick={() => { setPhone(""); setPhoneInput(""); }} className="text-[#A78BFA] hover:underline">Change number</button>
                </p>
              </>
            )}
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#a5a0cc] mb-1 block">Enter 6-digit code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
                className="w-full px-4 py-3 bg-[#0f0e1a] border border-[#3d3580] rounded-lg text-white text-center text-2xl tracking-[0.5em] font-mono focus:border-[#7C3AED] outline-none"
                placeholder="000000"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={verifyCode}
              disabled={verifying || code.length !== 6}
              className="w-full btn-primary py-3 rounded-lg font-bold text-sm disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Verify Code"}
            </button>
            <p className="text-center text-xs text-[#6b6899]">
              Didn&apos;t receive it?{" "}
              {countdown > 0 ? (
                <span className="text-[#a5a0cc]">Resend in {countdown}s</span>
              ) : (
                <button onClick={resendCode} className="text-[#A78BFA] hover:underline">
                  Resend code
                </button>
              )}
            </p>
          </div>
        )}

        {step === "verified" && (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <p className="text-[#10B981] font-bold">Phone verified successfully!</p>
            <p className="text-sm text-[#a5a0cc]">Redirecting to email verification...</p>
          </div>
        )}

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs flex items-center justify-center font-bold">1</div>
            <span className="text-xs text-[#10B981]">Signup</span>
          </div>
          <div className="w-8 h-px bg-[#3d3580]"></div>
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold ${step === "verified" ? "bg-[#10B981]" : "bg-[#7C3AED]"}`}>2</div>
            <span className={`text-xs ${step === "verified" ? "text-[#10B981]" : "text-[#A78BFA]"}`}>Phone</span>
          </div>
          <div className="w-8 h-px bg-[#3d3580]"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#3d3580] text-[#6b6899] text-xs flex items-center justify-center font-bold">3</div>
            <span className="text-xs text-[#6b6899]">Email</span>
          </div>
        </div>
      </div>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
