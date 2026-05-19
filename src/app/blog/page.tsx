import type { Metadata } from "next";
import { getAllPosts } from "../../lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — VPS Guides for eBay, Forex, Amazon & Ecommerce | UnicornVPS",
  description: "30+ expert guides on VPS hosting for eBay dropshipping, Forex trading, Amazon FBA, Etsy, Shopify, and ecommerce. UK, USA, EU, Pakistan-focused.",
  alternates: { canonical: "https://unicornvps.com/blog" },
  openGraph: {
    title: "Blog — VPS Guides for eBay, Forex, Amazon & Ecommerce",
    description: "Expert guides on using VPS for online business.",
    url: "https://unicornvps.com/blog",
    type: "website",
  },
};

const catColors: Record<string, string> = {
  "eBay": "#8b5cf6", "Forex": "#22c55e", "Amazon": "#f59e0b",
  "Guide": "#3b82f6", "Ecommerce": "#ec4899", "Country": "#06b6d4", "Pakistan": "#10b981"
};

const categories = ["All", "eBay", "Forex", "Amazon", "Ecommerce", "Pakistan", "Country", "Guide"];

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div style={{ minHeight: "100vh", background: "#08080a", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{background:#08080a}.bc:hover{border-color:rgba(139,92,246,.3)!important;transform:translateY(-2px)}.cf:hover{background:rgba(255,255,255,.06)!important}`}</style>

      <nav style={{ background: "rgba(8,8,10,.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "12px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#fff" }}>
            <svg width="24" height="24" viewBox="0 0 80 80"><rect width="80" height="80" rx="20" fill="#7C3AED"/><path d="M24 22L24 50Q24 64 40 64Q56 64 56 50L56 22" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="62" cy="20" r="5" fill="#F59E0B"/></svg>
            <span style={{ fontWeight: 700, fontSize: 16 }}>unicorn<span style={{ color: "#a78bfa" }}>vps</span></span>
          </a>
          <div style={{ display: "flex", gap: 16, fontSize: 13, alignItems: "center" }}>
            <a href="/#pricing" style={{ color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Pricing</a>
            <a href="/checkout?plan=business&region=uk&coupon=FLASH50" style={{ background: "#8b5cf6", color: "#fff", padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 12 }}>Get VPS</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-.03em", marginBottom: 8 }}>UnicornVPS Blog</h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: 16, marginBottom: 28, maxWidth: 640 }}>Expert guides for eBay sellers, Forex traders, Amazon FBA, Etsy creators, Shopify stores, and ecommerce entrepreneurs worldwide.</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {categories.map(cat => (
            <a key={cat} href={cat === "All" ? "#all" : `#${cat.toLowerCase()}`} className="cf" style={{ padding: "6px 14px", borderRadius: 99, background: cat === "All" ? "rgba(139,92,246,.15)" : "rgba(255,255,255,.03)", border: `1px solid ${cat === "All" ? "rgba(139,92,246,.3)" : "rgba(255,255,255,.06)"}`, color: cat === "All" ? "#c4b5fd" : "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: ".2s" }}>{cat}</a>
          ))}
        </div>

        {categories.filter(c => c !== "All").map(cat => {
          const catPosts = posts.filter(p => p.category === cat);
          if (catPosts.length === 0) return null;
          return (
            <section key={cat} id={cat.toLowerCase()} style={{ marginBottom: 40 }}>
              <h2 style={{ color: catColors[cat], fontSize: 18, fontWeight: 700, marginBottom: 14, letterSpacing: "-.01em", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: catColors[cat] }} />
                {cat} ({catPosts.length})
              </h2>
              <div style={{ display: "grid", gap: 12 }}>
                {catPosts.map(p => (
                  <a key={p.slug} href={`/blog/${p.slug}`} className="bc" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 20, transition: ".2s" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, fontSize: 11, color: "rgba(255,255,255,.4)" }}>
                      <span>{p.date}</span><span>·</span><span>{p.readTime} read</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-.01em", marginBottom: 6, lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)", lineHeight: 1.6, margin: 0 }}>{p.excerpt}</p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
