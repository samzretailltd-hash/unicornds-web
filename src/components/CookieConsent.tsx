"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("unicornds_cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("unicornds_cookie_consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("unicornds_cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-[#1E1B4B] border border-[#3d3580] rounded-xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-[#a5a0cc]">
            We use essential cookies for authentication and Google Analytics to improve our service. We don&apos;t use advertising or tracking cookies.{" "}
            <Link href="/privacy#cookies" className="text-[#A78BFA] underline">Learn more</Link>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={decline} className="px-4 py-2 text-xs text-[#6b6899] border border-[#3d3580] rounded-lg hover:text-white">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9]">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
