import Link from "next/link";

interface BlogLayoutProps {
  title: string;
  date: string;
  readTime: string;
  children: React.ReactNode;
}

export function BlogLayout({ title, date, readTime, children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0f0e1a]">
      <article className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/blog" className="text-[#A78BFA] hover:text-white text-sm transition-colors">
            ← Blog
          </Link>
        </div>

        <header className="mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-[#6b6899]">
            <time>{date}</time>
            <span>·</span>
            <span>{readTime} read</span>
            <span>·</span>
            <span>by UnicornDS Team</span>
          </div>
        </header>

        <div className="prose prose-invert prose-headings:font-bold prose-headings:text-white prose-p:text-[#c4bfe0] prose-p:leading-relaxed prose-a:text-[#A78BFA] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-[#c4bfe0] prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 max-w-none">
          {children}
        </div>

        {/* VPS CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/40 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need a VPS for your eBay business?</h3>
          <p className="text-sm text-[#a5a0cc] mb-4">
            UnicornVPS — Windows &amp; Linux VPS from $10/mo. 50% off with code FLASH50.
          </p>
          <a
            href="https://unicornvps.com/#pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E1B4B] rounded-xl font-bold transition-colors"
          >
            Get 50% Off at UnicornVPS →
          </a>
        </div>

        {/* Related articles */}
        <div className="mt-12 border-t border-[#3d3580]/40 pt-8">
          <h3 className="text-lg font-bold text-white mb-4">Related articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/why-ebay-sellers-need-vps" className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-4 hover:border-[#7C3AED]/50 transition-colors">
              <span className="text-sm font-bold text-white">Why eBay Dropshippers Need a VPS in 2026</span>
            </Link>
            <Link href="/blog/best-vps-for-ebay-dropshipping-2026" className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-4 hover:border-[#7C3AED]/50 transition-colors">
              <span className="text-sm font-bold text-white">5 Best VPS for eBay Dropshipping (2026)</span>
            </Link>
            <Link href="/blog/vps-setup-guide-ebay-sellers" className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-4 hover:border-[#7C3AED]/50 transition-colors">
              <span className="text-sm font-bold text-white">How to Set Up a Windows VPS for eBay</span>
            </Link>
            <Link href="/vps" className="bg-[#1E1B4B]/50 border border-[#F59E0B]/30 rounded-xl p-4 hover:border-[#F59E0B]/60 transition-colors">
              <span className="text-sm font-bold text-[#F59E0B]">🎟️ Get 50% Off UnicornVPS →</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
