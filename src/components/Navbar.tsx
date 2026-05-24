"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { SITE } from "@/lib/constants";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useGeo } from "@/lib/geo";
import { t } from "@/lib/i18n";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const geo = useGeo();
  const l = geo.language;

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0e1a]/85 backdrop-blur-xl border-b border-[#3d3580]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        <Link href="/" className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
          <Image src="/logo.svg" alt="UnicornDS" width={28} height={28} className="sm:w-8 sm:h-8" /> {SITE.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <Link href="/features" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.features', l)}</Link>
          <Link href="/#demos" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">Demos</Link>
          <Link href="/pricing" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.pricing', l)}</Link>
          <Link href="/courses" className="text-sm text-[#F59E0B] hover:text-white transition-colors font-bold">🎓 Mastery</Link>
          <Link href="/blog" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.blog', l)}</Link>
          <Link href="/support" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.support', l)}</Link>
          <Link href="/affiliate" className="text-sm text-[#F59E0B] hover:text-white transition-colors font-medium">{t('nav.affiliate', l)}</Link>
          <Link href="/free-guide" className="text-sm text-[#10B981] hover:text-white transition-colors font-medium">Free Guide</Link>
          {!user && (
            <Link href="/login" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.login', l)}</Link>
          )}
          <Link href={user ? "/dashboard" : "/signup"} className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">
            {user ? t('nav.dashboard', l) : t('nav.signup', l)}
          </Link>
          <LanguageSelector />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="lg:hidden ml-auto text-white text-2xl p-2" aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#0f0e1a] border-b border-[#3d3580] px-4 py-4 flex flex-col gap-1">
          <Link href="/features" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.features', l)}</Link>
          <Link href="/#demos" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">Demos</Link>
          <Link href="/pricing" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.pricing', l)}</Link>
          <Link href="/courses" onClick={close} className="text-[15px] text-[#F59E0B] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50 font-bold">🎓 Mastery (New)</Link>
          <Link href="/blog" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.blog', l)}</Link>
          <Link href="/support" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.support', l)}</Link>
          <Link href="/affiliate" onClick={close} className="text-[15px] text-[#F59E0B] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.affiliate', l)}</Link>
          <Link href="/free-guide" onClick={close} className="text-[15px] text-[#10B981] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">Free Guide 📘</Link>
          <div className="px-3 py-2"><LanguageSelector /></div>
          <div className="border-t border-[#3d3580]/30 my-2" />
          {user ? (
            <Link href="/dashboard" onClick={close} className="btn-primary py-3 rounded-lg text-[15px] font-bold text-center mt-1">{t('nav.dashboard', l)}</Link>
          ) : (
            <>
              <Link href="/login" onClick={close} className="text-[15px] text-[#a5a0cc] hover:text-white py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50">{t('nav.login', l)}</Link>
              <Link href="/signup" onClick={close} className="btn-primary py-3 rounded-lg text-[15px] font-bold text-center mt-1">{t('nav.signup', l)}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
