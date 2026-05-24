"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentChangelog, getCategoryStyle } from "@/lib/changelog";

/**
 * AnnouncementBar — Subtle news strip above hero content
 * - Auto-reads latest entry from changelog.ts
 * - Dismissable with X (localStorage per entry)
 * - Links to /changelog
 * - Clean, professional — not flashy
 */
export function AnnouncementBar() {
  const [show, setShow] = useState(false);

  const latest = getRecentChangelog(1)[0];
  const dismissKey = latest
    ? `uds_ann_${latest.date}_${latest.title.slice(0, 20).replace(/\s/g, "_")}`
    : "";
  const cat = latest ? getCategoryStyle(latest.category) : null;

  useEffect(() => {
    if (!dismissKey) return;
    if (localStorage.getItem(dismissKey) !== "1") {
      // Small delay so it animates in after page render
      setTimeout(() => setShow(true), 100);
    }
  }, [dismissKey]);

  if (!latest || !cat || !show) return null;

  return (
    <div className="w-full flex justify-center mb-6 opacity-0 translate-y-[-8px] transition-all duration-500 ease-out"
      ref={(el) => {
        if (el) requestAnimationFrame(() => {
          el.classList.remove("opacity-0", "translate-y-[-8px]");
          el.classList.add("opacity-100", "translate-y-0");
        });
      }}
    >
      <Link
        href="/changelog"
        className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full
          bg-gradient-to-r from-[#1E1B4B]/80 to-[#2d2875]/80
          border border-[#7C3AED]/30
          hover:border-[#7C3AED]/60 hover:from-[#1E1B4B] hover:to-[#2d2875]
          transition-all duration-300 backdrop-blur-sm
          max-w-[calc(100vw-2rem)]"
      >
        {/* Category pill */}
        <span
          className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: cat.bg, color: cat.color }}
        >
          <span>{cat.emoji}</span>
          <span className="hidden sm:inline">{cat.label}</span>
        </span>

        {/* Title */}
        <span className="text-sm text-[#e0d8ff] font-medium truncate">
          {latest.title}
        </span>

        {/* Arrow */}
        <span className="flex-shrink-0 text-[#A78BFA] group-hover:translate-x-0.5 transition-transform text-xs">
          →
        </span>

        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            localStorage.setItem(dismissKey, "1");
            setShow(false);
          }}
          className="flex-shrink-0 ml-1 w-5 h-5 rounded-full flex items-center justify-center
            text-[#6b6899] hover:text-white hover:bg-[#7C3AED]/30
            transition-colors text-xs leading-none"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </Link>
    </div>
  );
}
