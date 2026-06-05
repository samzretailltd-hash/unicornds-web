import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
};

type RelatedItem = { slug: string; title: string };

export function BlogLayout({
  meta,
  title,
  date,
  readTime,
  category,
  children,
  related = [],
}: {
  meta?: BlogMeta;
  title?: string;
  date?: string;
  readTime?: string;
  category?: string;
  children: React.ReactNode;
  related?: RelatedItem[];
}) {
  const resolvedTitle = meta?.title ?? title ?? "";
  const resolvedDate = meta?.date ?? date ?? "";
  const resolvedReadTime = meta?.readTime ?? readTime ?? "";
  const resolvedCategory = meta?.category ?? category ?? "Article";

  return (
    <>
      <Navbar />
      <article className="min-h-screen bg-[#0f0e1a] pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-[#7C3AED] hover:text-[#9333EA] text-sm">
            ← All articles
          </Link>

          <div className="mt-4 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#7C3AED]/20 text-[#A78BFA] mb-4">
              {resolvedCategory}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3 font-[family-name:var(--font-display)]">
              {resolvedTitle}
            </h1>
            <div className="flex items-center gap-3 text-sm text-[#6b6899]">
              {resolvedDate && <span>{resolvedDate}</span>}
              {resolvedDate && resolvedReadTime && <span>·</span>}
              {resolvedReadTime && <span>{resolvedReadTime}</span>}
            </div>
          </div>

          <div className="blog-prose text-[#c4c0e0] leading-relaxed space-y-5">
            {children}
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2d2766] border border-[#7C3AED]/30 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Try UnicornDS Free</h3>
              <p className="text-[#a5a0cc] text-sm mb-4">
                Source from Amazon, AliExpress &amp; Walmart. List on eBay in seconds.
              </p>
              <Link href="/pricing" className="inline-block px-5 py-2.5 rounded-lg font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #7C3AED, #9333EA)" }}>
                Start 7-Day Trial — £1 →
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2d2766] border border-[#F59E0B]/30 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">🎓 Free Mastery Course</h3>
              <p className="text-[#a5a0cc] text-sm mb-4">
                Learn eBay dropshipping step by step — included with every plan.
              </p>
              <Link href="/courses" className="inline-block px-5 py-2.5 rounded-lg font-bold text-sm" style={{ background: "#F59E0B", color: "#1E1B4B" }}>
                View Course →
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-white font-bold text-lg mb-4">Related articles</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="block bg-[#1E1B4B] border border-[#3d3580]/40 rounded-xl p-4 hover:border-[#7C3AED]/50 transition">
                    <span className="text-[#c4c0e0] text-sm font-medium hover:text-white">{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </>
  );
}
