import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG, getCategoryStyle, getAreaStyle, type ChangelogEntry } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog — What's New in UnicornDS",
  description: "Live changelog of UnicornDS updates: new features, bug fixes, improvements, and launches. Updated as we ship.",
  keywords: ["unicornds changelog", "unicornds updates", "ebay dropshipping tool updates", "unicornds release notes"],
  alternates: {
    canonical: "https://www.unicornds.io/changelog",
    types: {
      "application/rss+xml": "https://www.unicornds.io/changelog/rss.xml",
    },
  },
  openGraph: {
    title: "Changelog — What's New in UnicornDS",
    description: "Live changelog of UnicornDS updates. New features, bug fixes, improvements, launches.",
    url: "https://www.unicornds.io/changelog",
    type: "website",
    images: [
      {
        url: "https://www.unicornds.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "UnicornDS Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog — UnicornDS",
    description: "What's new in UnicornDS. Bug fixes, features, launches.",
    images: ["https://www.unicornds.io/og-image.png"],
  },
};

// Group entries by month
function groupByMonth(entries: ChangelogEntry[]): Map<string, ChangelogEntry[]> {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return groups;
}

export default function ChangelogPage() {
  const grouped = groupByMonth(CHANGELOG);

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "UnicornDS Changelog",
    description: "Live changelog of UnicornDS updates",
    url: "https://www.unicornds.io/changelog",
    publisher: {
      "@type": "Organization",
      name: "UnicornDS",
      url: "https://www.unicornds.io",
    },
    blogPost: CHANGELOG.slice(0, 20).map((entry) => ({
      "@type": "BlogPosting",
      headline: entry.title,
      datePublished: entry.date,
      description: entry.description,
      author: { "@type": "Organization", name: "UnicornDS" },
    })),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0f0e1a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-[#7C3AED]/12 border border-[#7C3AED]/25 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider mb-4">
            Changelog
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-extrabold text-white mb-3">
            What&apos;s new in UnicornDS
          </h1>
          <p className="text-[#a5a0cc] max-w-xl mx-auto">
            Every update, fix, and feature as we ship. Updated continuously.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <a
              href="/changelog/rss.xml"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E1B4B]/50 border border-[#3d3580] hover:border-[#7C3AED] text-sm text-[#A78BFA] transition-colors"
            >
              <span>📡</span> RSS feed
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E1B4B]/50 border border-[#3d3580] hover:border-[#7C3AED] text-sm text-[#A78BFA] transition-colors"
            >
              Open dashboard →
            </Link>
          </div>
        </div>

        {/* Category legend */}
        <div className="bg-[#1E1B4B]/30 border border-[#3d3580]/40 rounded-xl p-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center text-xs">
            {(["feature", "improvement", "fix", "launch", "security"] as const).map((cat) => {
              const s = getCategoryStyle(cat);
              return (
                <span key={cat} className="inline-flex items-center gap-1.5 text-[#a5a0cc]">
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Grouped entries */}
        <div className="space-y-12">
          {Array.from(grouped.entries()).map(([month, entries]) => (
            <section key={month}>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#6b6899] uppercase tracking-wider mb-6 sticky top-20 bg-[#0f0e1a]/90 backdrop-blur py-2 z-10">
                {month}
              </h2>

              <div className="space-y-4">
                {entries.map((entry, i) => {
                  const cat = getCategoryStyle(entry.category);
                  const area = getAreaStyle(entry.area);
                  const dateFmt = new Date(entry.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  });
                  return (
                    <article
                      key={`${entry.date}-${i}`}
                      className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 hover:border-[#7C3AED]/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-wrap">
                        {/* Category badge */}
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                          style={{ background: cat.bg, color: cat.color }}
                        >
                          <span>{cat.emoji}</span>
                          {cat.label}
                        </span>

                        {/* Area + version + date */}
                        <div className="flex items-center gap-2 text-xs text-[#6b6899] flex-wrap">
                          <span className="font-semibold" style={{ color: area.color }}>
                            {area.label}
                          </span>
                          {entry.version && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-[#a5a0cc]">{entry.version}</span>
                            </>
                          )}
                          <span>·</span>
                          <time dateTime={entry.date}>{dateFmt}</time>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-3 mb-1">{entry.title}</h3>
                      <p className="text-sm text-[#a5a0cc] leading-relaxed">{entry.description}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#7C3AED]/15 to-[#F59E0B]/15 border border-[#7C3AED]/40 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Found a bug? Got a feature idea?</h2>
          <p className="text-[#a5a0cc] mb-5">
            We ship fast because our customers tell us what to build next. Reply to any email — we read every message.
          </p>
          <a
            href="mailto:support@unicornds.io?subject=Feature%20Request%20or%20Bug%20Report"
            className="inline-block px-8 py-3 bg-[#F59E0B] hover:bg-[#FBBF24] text-[#1E1B4B] rounded-xl font-bold transition-colors"
          >
            Email support@unicornds.io
          </a>
        </div>
      </div>
    </div>
  );
}
