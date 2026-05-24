import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#3d3580]/20 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <div className="font-[family-name:var(--font-display)] font-extrabold text-lg text-white flex items-center gap-2 mb-3">
              <Image src="/logo.svg" alt="UnicornDS" width={28} height={28} /> {SITE.name}
            </div>
            <p className="text-sm text-[#a5a0cc] leading-relaxed">The all-in-one eBay automation tool for sellers worldwide.</p>
            <p className="text-xs text-[#6b6899] mt-4">© UnicornDS</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/#features" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">Pricing</Link>
              <Link href="/courses" className="text-sm text-[#F59E0B] hover:text-white transition-colors font-bold">🎓 Mastery Course</Link>
              <Link href="/ebay-fees-calculator" className="text-sm text-[#10B981] hover:text-white transition-colors font-bold">🧮 Free Fees Calculator</Link>
              <Link href="/guarantee" className="text-sm text-[#10B981] hover:text-white transition-colors">30-Day Guarantee</Link>
              <Link href="/#faq" className="text-sm text-[#a5a0cc] hover:text-[#A78BFA] transition-colors">FAQ</Link>
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
