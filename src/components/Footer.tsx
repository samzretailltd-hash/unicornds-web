import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/community";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#3d3580]/20 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="font-[family-name:var(--font-display)] font-extrabold text-lg text-white flex items-center gap-2 mb-3">
              <Image src="/logo.svg" alt="UnicornDS" width={28} height={28} /> {SITE.name}
            </div>
            <p className="text-sm text-[#a5a0cc] leading-relaxed">The all-in-one eBay automation tool for sellers worldwide.</p>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#A78BFA] hover:text-white transition-colors font-semibold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
              Join our Telegram
            </a>
            <p className="text-xs text-[#6b6899] mt-4">© UnicornDS</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/#features" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Pricing</Link>
              <Link href="/courses" className="text-sm text-[#F59E0B] hover:text-white transition-colors font-bold">🎓 Mastery Course</Link>
              <Link href="/vs/ecomsniper" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">vs EcomSniper</Link>
              <Link href="/guarantee" className="text-sm text-[#10B981] hover:text-white transition-colors">30-Day Guarantee</Link>
              <Link href="/about" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">About</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Free Tools</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/ebay-fees-calculator" className="text-sm text-[#10B981] hover:text-white transition-colors font-bold">🧮 eBay Fees Calculator</Link>
              <Link href="/profit-margin-calculator" className="text-sm text-[#10B981] hover:text-white transition-colors font-bold">📊 Profit Margin Calc</Link>
              <Link href="/glossary" className="text-sm text-[#a5a0cc] hover:text-white transition-colors">📖 Glossary</Link>
              <Link href="/free-guide" className="text-sm text-[#a5a0cc] hover:text-white transition-colors">📘 Free Guide</Link>
              <Link href="/blog" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Blog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/privacy" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Terms of Service</Link>
              <Link href="/support" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/blog" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Blog</Link>
              <Link href="/support" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Chat with Uni</Link>
              <a href={`mailto:${SITE.email}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">{SITE.email}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#3d3580]/15 pt-6">
          <p className="text-xs text-[#6b6899] text-center">&copy; {new Date().getFullYear()} {SITE.company}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
