import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UnicornVPS — 50% Off VPS for eBay Dropshippers",
  description: "Get 50% off Windows & Linux VPS from UnicornVPS. Perfect for running eBay stealth accounts, automation tools, and UnicornDS 24/7. UK, EU & US servers from $10/mo.",
  keywords: ["ebay vps", "dropshipping vps", "windows vps ebay", "vps for ebay sellers", "unicornvps", "cheap windows vps", "rdp server ebay"],
  alternates: { canonical: "https://www.unicornds.io/vps" },
  openGraph: {
    title: "UnicornVPS — 50% Off for UnicornDS Members",
    description: "Windows & Linux VPS for eBay dropshipping. UK, EU & US servers. 50% off with code FLASH50.",
    url: "https://www.unicornds.io/vps",
    type: "website",
    images: [{ url: "https://www.unicornds.io/og-image.png", width: 1200, height: 630, alt: "UnicornVPS Promo" }],
  },
};

const PLANS = [
  {
    name: "Starter",
    price: "$20",
    sale: "$10",
    specs: ["2 vCPU", "4 GB RAM", "40 GB NVMe SSD", "Unlimited bandwidth", "Dedicated IPv4", "Full RDP access"],
    best: "1-2 eBay accounts",
    link: "https://unicornvps.com/checkout?plan=starter&region=uk",
  },
  {
    name: "Business",
    price: "$36",
    sale: "$18",
    specs: ["4 vCPU", "8 GB RAM", "80 GB NVMe SSD", "Unlimited bandwidth", "Dedicated IPv4", "Full RDP access"],
    best: "3-5 eBay accounts + automation",
    popular: true,
    link: "https://unicornvps.com/checkout?plan=business&region=uk",
  },
  {
    name: "Enterprise",
    price: "$60",
    sale: "$30",
    specs: ["6 vCPU", "16 GB RAM", "120 GB NVMe SSD", "Unlimited bandwidth", "Dedicated IPv4", "Full RDP access"],
    best: "5+ accounts + heavy automation",
    link: "https://unicornvps.com/checkout?plan=enterprise&region=uk",
  },
];

const USE_CASES = [
  {
    icon: "🛒",
    title: "Run Multiple eBay Accounts Safely",
    desc: "Each VPS gets a clean dedicated IP. eBay sees separate devices, separate networks. No cross-linking, no suspensions.",
  },
  {
    icon: "🤖",
    title: "Run UnicornDS 24/7",
    desc: "Install Chrome + UnicornDS on your VPS. It runs overnight syncing orders, checking stock, and monitoring listings — even while you sleep.",
  },
  {
    icon: "👨‍💻",
    title: "Hire a VA Without Sharing Your PC",
    desc: "Give your virtual assistant RDP access to the VPS. They work on your eBay accounts without seeing your personal files or passwords.",
  },
  {
    icon: "📊",
    title: "Forex & Amazon FBA Too",
    desc: "Run MT4/MT5 trading bots, Amazon repricing tools, or any Windows software 24/7 on a dedicated server with sub-50ms latency.",
  },
];

const BLOG_LINKS = [
  { href: "/blog/why-ebay-sellers-need-vps", title: "Why eBay Dropshippers Need a VPS in 2026" },
  { href: "/blog/best-vps-for-ebay-dropshipping-2026", title: "5 Best VPS for eBay Dropshipping (2026 Compared)" },
  { href: "/blog/vps-setup-guide-ebay-sellers", title: "How to Set Up a Windows VPS for eBay Dropshipping" },
];

export default function VpsPromoPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0f0e1a]">
      <div className="max-w-6xl mx-auto px-4">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-xs text-[#F59E0B] font-semibold uppercase tracking-wider mb-4">
            From the makers of UnicornDS
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Your eBay business,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]">running 24/7</span>
          </h1>
          <p className="text-lg text-[#a5a0cc] max-w-2xl mx-auto mb-6">
            Enterprise-grade Windows &amp; Linux VPS for eBay sellers. Dedicated IPs, full RDP access, UK/EU/US servers. Run UnicornDS, manage multiple accounts, and hire VAs — all on one secure server.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/40 mb-8">
            <span className="text-xl">🎟️</span>
            <span className="text-white font-bold">50% OFF all plans</span>
            <span className="text-[#a5a0cc]">·</span>
            <code className="text-[#F59E0B] font-mono font-bold">FLASH50</code>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="https://unicornvps.com/#pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
            >
              Get 50% Off → unicornvps.com
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { stat: "99.9%", label: "Uptime SLA" },
            { stat: "<4h", label: "Provisioning" },
            { stat: "1Gbps", label: "Network" },
            { stat: "24/7", label: "WhatsApp Support" },
          ].map((s) => (
            <div key={s.label} className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 text-center">
              <div className="text-2xl font-extrabold text-white">{s.stat}</div>
              <div className="text-xs text-[#a5a0cc] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Why eBay sellers use UnicornVPS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-6 hover:border-[#7C3AED]/50 transition-colors">
                <span className="text-3xl block mb-3">{uc.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-[#a5a0cc] leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            Plans — 50% off with code <code className="text-[#F59E0B]">FLASH50</code>
          </h2>
          <p className="text-center text-[#a5a0cc] mb-8 text-sm">No contracts. Cancel anytime. Servers deployed in under 4 hours.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`bg-[#1E1B4B]/50 border rounded-2xl p-6 relative ${
                  (p as any).popular ? "border-[#F59E0B] ring-1 ring-[#F59E0B]/30" : "border-[#3d3580]/50"
                }`}
              >
                {(p as any).popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#F59E0B] text-[#1E1B4B] text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-3">{p.name}</h3>
                <div className="mb-4">
                  <span className="text-sm text-[#6b6899] line-through">{p.price}/mo</span>
                  <span className="text-3xl font-extrabold text-[#F59E0B] ml-2">{p.sale}</span>
                  <span className="text-sm text-[#a5a0cc]">/mo</span>
                </div>
                <p className="text-xs text-[#10B981] font-bold mb-4">Best for: {p.best}</p>
                <ul className="space-y-2 mb-6">
                  {p.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-[#a5a0cc]">
                      <span className="text-[#10B981]">✓</span> {s}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm text-[#a5a0cc]">
                    <span className="text-[#10B981]">✓</span> DDoS protection
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#a5a0cc]">
                    <span className="text-[#10B981]">✓</span> 24/7 WhatsApp support
                  </li>
                </ul>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                    (p as any).popular
                      ? "bg-[#F59E0B] hover:bg-[#D97706] text-[#1E1B4B]"
                      : "bg-[#7C3AED] hover:bg-[#9333EA] text-white"
                  }`}
                >
                  Get {p.name} →
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#6b6899] mt-4">
            Apply code <code className="text-[#F59E0B] font-bold">FLASH50</code> at checkout for 50% off
          </p>
        </div>

        {/* Blog links */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white mb-4">
            Learn more about VPS for eBay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BLOG_LINKS.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="bg-[#1E1B4B]/50 border border-[#3d3580]/50 rounded-xl p-5 hover:border-[#7C3AED]/50 transition-colors group"
              >
                <span className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors">{b.title}</span>
                <span className="block mt-2 text-xs text-[#A78BFA]">Read article →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white text-center mb-6">Common questions</h2>
          <div className="space-y-3">
            {[
              { q: "Can I run UnicornDS on a VPS?", a: "Yes. Install Chrome on your Windows VPS, log into UnicornDS, and it runs 24/7. Sync orders, check stock, and auto-list — even when your laptop is off." },
              { q: "Is this safe for multiple eBay accounts?", a: "Each VPS gets a clean, dedicated IP address. eBay sees a separate device and network. As long as you use different payment methods and addresses per account, there's no cross-linking." },
              { q: "What's the difference between UnicornDS and UnicornVPS?", a: "UnicornDS is the Chrome extension for listing, order management, and automation on eBay. UnicornVPS is the server that keeps everything running 24/7. They're made by the same team and work perfectly together." },
              { q: "Can my VA access the VPS?", a: "Yes. Share the RDP login credentials with your VA. They connect remotely and work on your eBay accounts without accessing your personal computer. You can see exactly what they do." },
              { q: "How long to set up?", a: "Most servers are deployed within 1-4 hours. You receive RDP credentials via email. Connect with Windows Remote Desktop or any RDP client." },
            ].map((faq) => (
              <details key={faq.q} className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl group">
                <summary className="p-4 cursor-pointer font-semibold text-white text-sm flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-[#A78BFA] text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#a5a0cc]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-[#F59E0B]/15 to-[#7C3AED]/15 border border-[#F59E0B]/40 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Start your VPS in under 4 hours</h2>
          <p className="text-[#a5a0cc] mb-5">50% off all plans. No contracts. Cancel anytime.</p>
          <a
            href="https://unicornvps.com/#pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E1B4B] rounded-xl text-lg font-extrabold transition-all"
          >
            Get 50% Off at unicornvps.com →
          </a>
          <p className="mt-3 text-xs text-[#6b6899]">Code: FLASH50 · From the makers of UnicornDS</p>
        </div>
      </div>
    </div>
  );
}
