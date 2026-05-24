"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getRecentChangelog, getCategoryStyle, getAreaStyle } from "@/lib/changelog";

export function ChangelogWidget() {
  const recent = getRecentChangelog(5);
  const [seenDate, setSeenDate] = useState<string | null>(null);

  useEffect(() => {
    setSeenDate(localStorage.getItem("uds_changelog_seen"));
  }, []);

  const latestDate = recent[0]?.date;
  const hasUnseen = latestDate && (!seenDate || seenDate < latestDate);

  const markAsSeen = () => {
    if (latestDate) {
      localStorage.setItem("uds_changelog_seen", latestDate);
      setSeenDate(latestDate);
    }
  };

  if (recent.length === 0) return null;

  return (
    <div className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#3d3580]/40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📰</span>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              What&apos;s New
              {hasUnseen && (
                <span className="inline-flex items-center justify-center w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" title="New updates" />
              )}
            </h2>
            <p className="text-xs text-[#6b6899] mt-0.5">Latest UnicornDS updates</p>
          </div>
        </div>
        <Link
          href="/changelog"
          onClick={markAsSeen}
          className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Entries */}
      <div className="divide-y divide-[#3d3580]/30">
        {recent.map((entry, i) => {
          const cat = getCategoryStyle(entry.category);
          const area = getAreaStyle(entry.area);
          const dateFmt = new Date(entry.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
          const isUnseen = !seenDate || entry.date > seenDate;

          return (
            <div
              key={`${entry.date}-${i}`}
              className={`p-4 hover:bg-[#0f0e1a]/40 transition-colors ${isUnseen ? "bg-[#7C3AED]/5" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5" title={cat.label}>
                  {cat.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold mb-1 flex-wrap">
                    <span style={{ color: cat.color }}>{cat.label}</span>
                    <span className="text-[#3d3580]">·</span>
                    <span style={{ color: area.color }}>{area.label}</span>
                    {entry.version && (
                      <>
                        <span className="text-[#3d3580]">·</span>
                        <span className="text-[#6b6899] font-mono">{entry.version}</span>
                      </>
                    )}
                    <span className="text-[#3d3580]">·</span>
                    <time dateTime={entry.date} className="text-[#6b6899]">{dateFmt}</time>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-tight">{entry.title}</h3>
                  <p className="text-xs text-[#a5a0cc] leading-relaxed line-clamp-2">{entry.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#0f0e1a]/40 text-center border-t border-[#3d3580]/30">
        <Link
          href="/changelog"
          onClick={markAsSeen}
          className="text-xs text-[#A78BFA] hover:text-white transition-colors"
        >
          See full changelog →
        </Link>
      </div>
    </div>
  );
}
