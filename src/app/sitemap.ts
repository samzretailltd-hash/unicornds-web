import { MetadataRoute } from "next";

// ══════════ All blog post slugs — ADD NEW POSTS HERE ══════════
const blogSlugs = [
  // Pillar / Getting Started
  "how-to-start-ebay-dropshipping",
  "amazon-to-ebay-arbitrage",
  "aliexpress-to-ebay-dropshipping",

  // USA
  "how-to-dropship-ebay-usa",
  "amazon-prime-ebay-arbitrage-usa",
  "best-ebay-tools-us-sellers",
  "ebay-shipping-guide-usa",
  "ebay-side-hustle-2026",
  "best-products-sell-ebay-usa",
  "ebay-taxes-1099k-sellers",
  "ebay-dropshipping-california-texas",

  // Canada
  "ebay-dropshipping-canada",
  "amazon-ca-to-ebay-arbitrage",
  "ebay-canada-fees-taxes",
  "best-products-sell-ebay-canada",
  "ebay-shipping-canada-guide",
  "ebay-dropshipping-canada-to-usa",

  // Europe
  "ebay-dropshipping-germany-guide",
  "ebay-dropshipping-france",
  "ebay-dropshipping-spain-italy",
  "ebay-dropshipping-netherlands",
  "ebay-dropshipping-poland",
  "ebay-dropshipping-ireland",
  "ebay-dropshipping-belgium-austria",
  "ebay-vat-europe-guide",
  "amazon-to-ebay-arbitrage-europe",
  "best-products-dropship-ebay-europe",
  "ebay-global-shipping-programme",

  // Australia
  "ebay-dropshipping-australia",

  // Comparisons
  "unicornds-vs-autods",
  "unicornds-vs-ecomsniper",
  "unicornds-vs-zik-analytics",
  "autods-vs-zik-analytics",
  "ebay-vs-amazon-selling",
  "ebay-vs-mercari-poshmark",
  "best-ebay-listing-tools-2026",
  "best-ebay-competitor-research-tools",
  "best-ai-listing-tool-ebay",
  "chrome-extensions-ebay-sellers",
  "ebay-seller-tools-comparison",

  // Feature posts
  "ebay-bulk-lister-chrome-extension",
  "ebay-auto-lister-free",
  "ebay-vero-checker-tool",
  "ebay-vero-list-2026",
  "ebay-address-helper-aliexpress",
  "ebay-variant-images-auto-upload",
  "ebay-seo-title-optimization",
  "ebay-item-specifics-guide",
  "ai-tools-ebay-listings-2026",

  // Strategy / Guides
  "how-many-listings-per-day-ebay",
  "ebay-profit-margins-guide",
  "ebay-account-levels-selling-limits",
  "how-to-increase-ebay-selling-limits",
  "how-to-avoid-ebay-account-suspension",
  "ebay-dropshipping-suppliers-2026",
  "how-to-price-products-ebay",
  "ebay-fees-calculator-2026",
  "ebay-promoted-listings-strategy",
  "ebay-dropshipping-mistakes-to-avoid",
  "ebay-shipping-guide-uk",
  "ebay-return-policy-sellers",
  "ebay-store-subscription-guide",
  "ebay-seller-hub-guide",
  "walmart-to-ebay-arbitrage",
];

// ══════════ Feature page slugs ══════════
const featureSlugs = [
  "product-hunter",
  "ai-titles",
  "competitor-scanner",
  "bulk-lister",
  "image-designer",
  "stock-checker",
  "vero-protection",
  "demand-score",
  "one-click-listing",
  "address-helper",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.unicornds.io";
  const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Primary pages
  const primaryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ebay-fees-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/profit-margin-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vs/ecomsniper`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guarantee`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/free-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/book-call`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/handbook`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Feature pages
  const featurePages: MetadataRoute.Sitemap = featureSlugs.map((slug) => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...primaryPages, ...featurePages, ...blogPages];
}
