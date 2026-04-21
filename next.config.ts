import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // ══════════ Force non-www → www (canonical) ══════════
      {
        source: "/:path*",
        has: [{ type: "host", value: "unicornds.io" }],
        destination: "https://www.unicornds.io/:path*",
        permanent: true,
      },
      // ══════════ Ghost URLs from old sitemaps — 301 to closest match ══════════
      {
        source: "/blog/ai-tools-ebay-listings-2026",
        destination: "/blog/best-ai-listing-tool-ebay",
        permanent: true,
      },
      {
        source: "/blog/amazon-to-ebay-arbitrage-europe",
        destination: "/blog/amazon-to-ebay-arbitrage",
        permanent: true,
      },
      {
        source: "/blog/best-products-dropship-ebay-europe",
        destination: "/blog/ebay-dropshipping-germany-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
