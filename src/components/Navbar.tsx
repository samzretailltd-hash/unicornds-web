"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { SITE } from "@/lib/constants";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useGeo } from "@/lib/geo";
import { t } from "@/lib/i18n";

interface DropdownItem {
  href: string;
  label: string;
  desc: string;
  icon: string;
  highlight?: "gold" | "green" | "purple";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const geo = useGeo();
  const l = geo.language;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const close = () => setOpen(false);

  const handleDropdownEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const PRODUCT_ITEMS: DropdownItem[] = [
    { href: "/features", label: "Features", desc: "All extension capabilities", icon: "✨" },
    { href: "/#demos", label: "Demos", desc: "See it in action", icon: "▶️" },
    { href: "/pricing", label: "Pricing", desc: "Plans from £29.99/mo", icon: "💰" },
    { href: "/courses", label: "Mastery Course", desc: "FREE with Growth & Empire", icon: "🎓", highlight: "gold" },
    { href: "/guarantee", label: "30-Day Guarantee", desc: "Refund if no sales", icon: "💯", highlight: "green" },
  ];

  const TOOLS_ITEMS: DropdownItem[] = [
    { href: "/ebay-fees-calculator", label: "eBay Fees Calculator", desc: "Calculate profit in seconds", icon: "🧮", highlight: "green" },
    { href: "/free-guide", label: "Free Beginner's Guide", desc: "Start dropshipping today", icon: "📘", highlight: "green" },
    { href: "/blog", label: "Dropshipping Blog", desc: "64+ guides & tutorials", icon: "📚" },
  ];

  const RESOURCES_ITEMS: DropdownItem[] = [
    { href: "/support", label: "Support", desc: "Get help fast", icon: "💬" },
    { href: "/affiliate", label: "Affiliate Program", desc: "Earn 30% commission", icon: "🤝", highlight: "gold" },
    { href: "/handbook", label: "Handbook", desc: "How everything works", icon: "📖" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0e1a]/85 backdrop-blur-xl border-b border-[#3d3580]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        <Link href="/" className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
          <Image src="/logo.svg" alt="UnicornDS" width={28} height={28} className="sm:w-8 sm:h-8" /> {SITE.name}
        </Link>

        <div className="hidden lg:flex items-center gap-1 ml-auto">
          <Dropdown
            label="Product"
            isOpen={openDropdown === "product"}
            onEnter={() => handleDropdownEnter("product")}
            onLeave={handleDropdownLeave}
            items={PRODUCT_ITEMS}
          />
          <Dropdown
            label="Free Tools"
            badge="NEW"
            isOpen={openDropdown === "tools"}
            onEnter={() => handleDropdownEnter("tools")}
            onLeave={handleDropdownLeave}
            items={TOOLS_ITEMS}
          />
          <Dropdown
            label="Resources"
            isOpen={openDropdown === "resources"}
            onEnter={() => handleDropdownEnter("resources")}
            onLeave={handleDropdownLeave}
            items={RESOURCES_ITEMS}
          />

          <div className="ml-3 flex items-center gap-3">
            {!user && (
              <Link href="/login" className="text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">{t('nav.login', l)}</Link>
            )}
            <Link href={user ? "/dashboard" : "/signup"} className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold">
              {user ? t('nav.dashboard', l) : t('nav.signup', l)}
            </Link>
            <LanguageSelector />
          </div>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden ml-auto text-white text-2xl p-2" aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#0f0e1a] border-b border-[#3d3580] px-4 py-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto">
          <MobileSection title="Product" items={PRODUCT_ITEMS} close={close} />
          <MobileSection title="Free Tools 🎁" items={TOOLS_ITEMS} close={close} />
          <MobileSection title="Resources" items={RESOURCES_ITEMS} close={close} />
          <div className="px-3 py-2 mt-2"><LanguageSelector /></div>
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

function Dropdown({ label, badge, items, isOpen, onEnter, onLeave }: {
  label: string;
  badge?: string;
  items: DropdownItem[];
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#a5a0cc] hover:text-white transition-colors font-medium">
        {label}
        {badge && (
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#F59E0B] text-[#1E1B4B] rounded-full">
            {badge}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 min-w-[320px]">
          <div className="bg-[#1E1B4B] border border-[#3d3580] rounded-xl shadow-2xl shadow-black/50 p-2">
            {items.map(item => {
              const colorClass = item.highlight === "gold" ? "hover:border-[#F59E0B]/50" :
                                 item.highlight === "green" ? "hover:border-[#10B981]/50" :
                                 item.highlight === "purple" ? "hover:border-[#7C3AED]/50" :
                                 "hover:border-[#3d3580]";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#0f0e1a]/60 border border-transparent ${colorClass} transition-all`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${
                      item.highlight === "gold" ? "text-[#F59E0B]" :
                      item.highlight === "green" ? "text-[#10B981]" :
                      "text-white"
                    }`}>{item.label}</div>
                    <div className="text-xs text-[#a5a0cc] mt-0.5">{item.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileSection({ title, items, close }: { title: string; items: DropdownItem[]; close: () => void }) {
  return (
    <div className="mb-2">
      <div className="px-3 py-2 text-[11px] font-bold text-[#6b6899] uppercase tracking-wider">{title}</div>
      {items.map(item => {
        const textColor = item.highlight === "gold" ? "text-[#F59E0B]" :
                         item.highlight === "green" ? "text-[#10B981]" :
                         "text-[#c4c0e0]";
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className={`flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#1E1B4B]/50 ${textColor} ${item.highlight ? "font-bold" : ""}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[15px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
