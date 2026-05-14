"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function BookCallPage() {
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return; }
      // Check if already booked
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.call_booked) {
          router.push("/dashboard");
          return;
        }
      } catch { /* continue */ }
      setLoading(false);
    });
  }, [router]);

  const openCalendly = () => {
    window.open("https://calendly.com/1stunicornltd/30min", "_blank");
    setOpened(true);
  };

  const confirmBooked = async () => {
    setConfirming(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      router.push("/dashboard");
    } catch {
      alert("Something went wrong. Please try again.");
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#a5a0cc]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📞</div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-white mb-2">
            One Last Step — Book Your Free Call
          </h1>
          <p className="text-sm text-[#a5a0cc] leading-relaxed">
            Every new UnicornDS user gets a <span className="text-[#F59E0B] font-bold">free 1-on-1 setup call</span> with
            Zohaib (the founder). This is mandatory to make sure you get the most out of your trial.
          </p>
        </div>

        {/* What you get */}
        <div className="bg-[#0f0e1a] border border-[#3d3580] rounded-lg p-4 mb-6">
          <p className="text-xs text-[#F59E0B] font-bold mb-3">ON THE CALL, I WILL:</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#10B981] flex-shrink-0 mt-0.5">✅</span>
              <span className="text-sm text-[#c4c0e0]">Set up your extension settings and pricing rules</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#10B981] flex-shrink-0 mt-0.5">✅</span>
              <span className="text-sm text-[#c4c0e0]">Find your first winning products together</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#10B981] flex-shrink-0 mt-0.5">✅</span>
              <span className="text-sm text-[#c4c0e0]">Create your first eBay listings live</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#10B981] flex-shrink-0 mt-0.5">✅</span>
              <span className="text-sm text-[#c4c0e0]">Answer all your questions personally</span>
            </div>
          </div>
          <p className="text-xs text-[#6b6899] mt-3">30 minutes · Google Meet · Weekdays 9am–5pm UK time</p>
        </div>

        {/* CTA */}
        <button
          onClick={openCalendly}
          className="w-full py-4 rounded-xl font-bold text-base transition-all bg-[#F59E0B] hover:bg-[#D97706] text-white mb-3"
        >
          📅 Book Your Free 30-Min Call
        </button>

        {opened && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={confirmBooked}
              disabled={confirming}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all btn-primary disabled:opacity-50 mb-3"
            >
              {confirming ? "Confirming..." : "✅ I've Booked My Call — Take Me to Dashboard"}
            </button>
          </div>
        )}

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs flex items-center justify-center font-bold">1</div>
            <span className="text-xs text-[#10B981]">Signup</span>
          </div>
          <div className="w-6 h-px bg-[#3d3580]"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs flex items-center justify-center font-bold">2</div>
            <span className="text-xs text-[#10B981]">Phone</span>
          </div>
          <div className="w-6 h-px bg-[#3d3580]"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#10B981] text-white text-xs flex items-center justify-center font-bold">3</div>
            <span className="text-xs text-[#10B981]">Email</span>
          </div>
          <div className="w-6 h-px bg-[#3d3580]"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-xs flex items-center justify-center font-bold">4</div>
            <span className="text-xs text-[#A78BFA]">Call</span>
          </div>
        </div>
      </div>
    </div>
  );
}
