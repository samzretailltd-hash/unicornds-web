import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "../../../lib/blog-posts";

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `https://unicornvps.com/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://unicornvps.com/blog/${post.slug}`,
      siteName: "UnicornVPS",
      type: "article",
      publishedTime: post.date,
      authors: ["UnicornVPS Team"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.metaDescription },
  };
}

const catColors: Record<string, string> = {
  "eBay": "#8b5cf6", "Forex": "#22c55e", "Amazon": "#f59e0b",
  "Guide": "#3b82f6", "Ecommerce": "#ec4899", "Country": "#06b6d4", "Pakistan": "#10b981"
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);
  const color = catColors[post.category] || "#8b5cf6";

  // JSON-LD: Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "UnicornVPS", url: "https://unicornvps.com" },
    publisher: { "@type": "Organization", name: "UnicornVPS", logo: { "@type": "ImageObject", url: "https://unicornvps.com/logo.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://unicornvps.com/blog/${post.slug}` },
  };

  // JSON-LD: FAQ schema (if FAQ exists)
  const faqSchema = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  } : null;

  // JSON-LD: Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://unicornvps.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://unicornvps.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://unicornvps.com/blog/${post.slug}` },
    ]
  };

  const ctaPlan = post.cta?.plan || "business";
  const ctaRegion = post.cta?.region || "uk";
  const ctaCoupon = post.cta?.coupon || "FLASH50";

  return (
    <div style={{ minHeight: "100vh", background: "#08080a", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{background:#08080a}article a{color:#a78bfa;text-decoration:underline}article a:hover{color:#c4b5fd}article h2{color:#fff;font-size:24px;font-weight:700;margin-top:36px;margin-bottom:14px;letter-spacing:-.02em}article p{margin-bottom:16px;line-height:1.8;color:rgba(255,255,255,.75);font-size:15.5px}.rp:hover{border-color:rgba(139,92,246,.3)!important;transform:translateY(-2px)}`}</style>

      <nav style={{ background: "rgba(8,8,10,.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "12px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#fff" }}>
            <svg width="24" height="24" viewBox="0 0 80 80"><rect width="80" height="80" rx="20" fill="#7C3AED"/><path d="M24 22L24 50Q24 64 40 64Q56 64 56 50L56 22" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="62" cy="20" r="5" fill="#F59E0B"/></svg>
            <span style={{ fontWeight: 700, fontSize: 16 }}>unicorn<span style={{ color: "#a78bfa" }}>vps</span></span>
          </a>
          <div style={{ display: "flex", gap: 16, fontSize: 13, alignItems: "center" }}>
            <a href="/blog" style={{ color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Blog</a>
            <a href="/#pricing" style={{ color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Pricing</a>
            <a href={`/checkout?plan=${ctaPlan}&region=${ctaRegion}&coupon=${ctaCoupon}`} style={{ background: "#8b5cf6", color: "#fff", padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 12 }}>Get VPS</a>
          </div>
        </div>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 24, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
          <a href="/" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <a href="/blog" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>Blog</a>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: color }}>{post.category}</span>
        </nav>

        {/* Header */}
        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${color}20`, color: color, marginBottom: 12 }}>{post.category}</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 14 }}>{post.title}</h1>
        <div style={{ display: "flex", gap: 16, color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 32, flexWrap: "wrap" }}>
          <span>📅 {post.date}</span>
          <span>⏱ {post.readTime} read</span>
          <span>✍️ UnicornVPS Team</span>
        </div>

        {/* Intro */}
        <p style={{ marginBottom: 24, lineHeight: 1.8, color: "rgba(255,255,255,.85)", fontSize: 17, fontWeight: 500 }}>{post.intro}</p>

        {/* Sections */}
        {post.sections.map((sec, i) => (
          <section key={i}>
            <h2>{sec.h2}</h2>
            {sec.content.map((paragraph, j) => (
              <p key={j} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </section>
        ))}

        {/* Mid-article CTA */}
        <div style={{ marginTop: 40, padding: 28, background: "linear-gradient(135deg, rgba(124,58,237,.12), rgba(245,158,11,.08))", border: "1px solid rgba(124,58,237,.25)", borderRadius: 14, textAlign: "center" }}>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: "-.02em" }}>Ready to start?</h3>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, marginBottom: 18 }}>Deploy your VPS in under 4 hours. Use code <strong style={{ color: "#fbbf24" }}>{ctaCoupon}</strong> for 50% off.</p>
          <a href={`/checkout?plan=${ctaPlan}&region=${ctaRegion}&coupon=${ctaCoupon}`} style={{ display: "inline-block", padding: "12px 28px", borderRadius: 8, background: "#8b5cf6", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Get Started Now →</a>
        </div>

        {/* FAQ */}
        {post.faq && post.faq.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 14 }}>Frequently Asked Questions</h2>
            {post.faq.map((f, i) => (
              <details key={i} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "14px 18px", marginBottom: 10 }}>
                <summary style={{ cursor: "pointer", color: "#fff", fontSize: 15, fontWeight: 600 }}>{f.q}</summary>
                <p style={{ marginTop: 10, color: "rgba(255,255,255,.7)", fontSize: 14.5, lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </section>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Related Articles</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {related.map(r => (
                <a key={r.slug} href={`/blog/${r.slug}`} className="rp" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: 16, transition: ".2s" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: `${catColors[r.category]}20`, color: catColors[r.category], marginBottom: 6 }}>{r.category}</span>
                  <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ color: "rgba(255,255,255,.45)", fontSize: 13 }}>{r.excerpt}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div style={{ marginTop: 60, padding: 32, background: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 100%)", borderRadius: 14, textAlign: "center", border: "1px solid rgba(124,58,237,.3)" }}>
          <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 10, letterSpacing: "-.02em" }}>🦄 Try UnicornVPS Risk-Free</h3>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15, marginBottom: 20 }}>Premium Windows VPS from $10/month. Cancel anytime. 24/7 support.</p>
          <a href={`/checkout?plan=${ctaPlan}&region=${ctaRegion}&coupon=${ctaCoupon}`} style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: "#F59E0B", color: "#1E1B4B", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>Claim 50% Off →</a>
        </div>
      </article>
    </div>
  );
}
