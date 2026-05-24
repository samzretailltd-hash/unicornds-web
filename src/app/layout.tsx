import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Providers } from "@/components/Providers";
import { AutoLogout } from "@/components/AutoLogout";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "UnicornDS — eBay Dropshipping Chrome Extension | Amazon to eBay Arbitrage Tool",
    template: "%s | UnicornDS",
  },
  description:
    "The #1 Chrome extension for eBay dropshipping. Source from Amazon & AliExpress, list on eBay in seconds with AI titles, VERO protection & bulk listing. 7-day trial from £1.",
  metadataBase: new URL("https://www.unicornds.io"),
  alternates: {
    canonical: "https://www.unicornds.io",
    languages: {
      "en-GB": "https://www.unicornds.io",
      "en-US": "https://www.unicornds.io",
      "en-AU": "https://www.unicornds.io",
      "en-CA": "https://www.unicornds.io",
      "de-DE": "https://www.unicornds.io",
      "fr-FR": "https://www.unicornds.io",
      "es-ES": "https://www.unicornds.io",
      "x-default": "https://www.unicornds.io",
    },
  },
  openGraph: {
    title: "UnicornDS — eBay Dropshipping Chrome Extension",
    description:
      "Amazon arbitrage + AliExpress dropshipping in one Chrome extension. AI titles, bulk listing, competitor scanning, VERO protection. 7-day trial from £1.",
    url: "https://www.unicornds.io",
    siteName: "UnicornDS",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.unicornds.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "UnicornDS — eBay Dropshipping Chrome Extension",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnicornDS — eBay Dropshipping Chrome Extension",
    description:
      "Find profitable products on Amazon & AliExpress, list on eBay in seconds with AI titles & VERO protection.",
    images: ["https://www.unicornds.io/og-image.png"],
  },
  robots: { index: true, follow: true },
  // ══════════ IMPORTANT: Replace with your REAL Google Search Console code ══════════
  // Go to https://search.google.com/search-console → Add Property → URL prefix → 
  // Enter https://www.unicornds.io → Choose HTML tag method → Copy the content value
  verification: {
    google: "REPLACE_WITH_REAL_CODE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "UnicornDS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Chrome",
  offers: [
    {
      "@type": "Offer",
      price: "29.99",
      priceCurrency: "GBP",
      name: "Starter Plan",
      description: "500 eBay listings/month. 7-day trial for £1.",
      url: "https://www.unicornds.io/pricing",
    },
    {
      "@type": "Offer",
      price: "59.99",
      priceCurrency: "GBP",
      name: "Growth Plan",
      description: "1,500 eBay listings/month. 7-day trial for £5.",
      url: "https://www.unicornds.io/pricing",
    },
    {
      "@type": "Offer",
      price: "99.99",
      priceCurrency: "GBP",
      name: "Empire Plan",
      description: "3,000 eBay listings/month. 7-day trial for £10.",
      url: "https://www.unicornds.io/pricing",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
    bestRating: "5",
  },
  description:
    "Chrome extension for eBay dropshipping and Amazon arbitrage. AI-powered titles, VERO protection for 3,390 brands, bulk listing, competitor scanning, and stock checking.",
  url: "https://www.unicornds.io",
  downloadUrl: "https://www.unicornds.io/download",
  screenshot: "https://www.unicornds.io/screenshots/overlay.png",
  publisher: {
    "@type": "Organization",
    name: "UnicornDS",
    url: "https://www.unicornds.io",
    logo: {
      "@type": "ImageObject",
      url: "https://www.unicornds.io/logo.png",
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is UnicornDS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UnicornDS is a Chrome browser extension that helps eBay sellers find profitable products on Amazon and AliExpress, then list them on eBay automatically with AI-generated titles, VERO brand checking, and bulk listing capabilities.",
      },
    },
    {
      "@type": "Question",
      name: "How much does UnicornDS cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plans start at £29.99/month for 500 listings (Starter), £59.99 for 1,500 listings (Growth), and £99.99 for 3,000 listings (Empire). 7-day trials available: Starter £1, Growth £5, Empire £10. Annual plans save 20%. Cancel anytime.",
      },
    },
    {
      "@type": "Question",
      name: "How does UnicornDS compare to AutoDS and EcomSniper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UnicornDS Empire offers 3,000 listings for £99.99/month compared to EcomSniper at $199/month. Unlike AutoDS and ZIK Analytics, UnicornDS combines both product research AND listing automation in one tool, with exclusive features like AI GPT-4o titles, VERO protection for 3,390 brands, and per-variant image upload.",
      },
    },
    {
      "@type": "Question",
      name: "Does UnicornDS work with Amazon and AliExpress?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, UnicornDS supports both Amazon arbitrage (US, UK, DE, AU) and AliExpress dropshipping. You can find products on either platform and list them on any eBay marketplace worldwide including UK, US, DE, FR, AU, CA, IT, ES.",
      },
    },
    {
      "@type": "Question",
      name: "What is VERO protection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VERO (Verified Rights Owner) is eBay's brand protection program. UnicornDS automatically checks every product against 3,390 known VERO brands before listing, preventing account suspensions from intellectual property violations.",
      },
    },
    {
      "@type": "Question",
      name: "Is eBay dropshipping legal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. eBay allows dropshipping as long as you guarantee delivery within the stated timeframe and handle customer service. Thousands of sellers worldwide run profitable dropshipping businesses on eBay using Amazon and AliExpress as suppliers.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UnicornDS",
  url: "https://www.unicornds.io",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.unicornds.io/blog?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UnicornDS",
  legalName: "1st Unicorn Distribution LTD",
  url: "https://www.unicornds.io",
  logo: "https://www.unicornds.io/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@unicornds.io",
    contactType: "customer support",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.youtube.com/@Unicornds_io",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manchester",
    addressCountry: "GB",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <GoogleAnalytics />
          <AutoLogout />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ChatWidget />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
