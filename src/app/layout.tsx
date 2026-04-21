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
    default: "UnicornDS — eBay Dropshipping & Amazon Arbitrage Automation Tool",
    template: "%s | UnicornDS",
  },
  description: "#1 Chrome extension for eBay dropshipping. Source from Amazon & AliExpress, list on eBay with AI titles, VERO protection, bulk listing. Free trial.",
  keywords: [
    "eBay dropshipping tool", "Amazon to eBay arbitrage", "AliExpress dropshipping",
    "eBay listing software", "eBay automation", "product research tool",
    "bulk lister eBay", "eBay seller tools", "dropshipping Chrome extension",
    "Amazon arbitrage", "eBay product hunter", "competitor scanner eBay",
    "VERO checker", "AI eBay titles", "eBay stock checker",
    "eBay dropshipping USA", "eBay dropshipping Australia", "eBay dropshipping Germany",
    "Amazon arbitrage US", "Amazon arbitrage Europe", "eBay automation tool",
    "eBay lister Chrome", "dropship from Amazon to eBay", "AliExpress to eBay tool",
  ],
  metadataBase: new URL("https://www.unicornds.io"),
  alternates: { canonical: "https://www.unicornds.io" },
  openGraph: {
    title: "UnicornDS — Find, List & Sell on eBay Automatically",
    description: "Amazon arbitrage + AliExpress dropshipping in one Chrome extension. AI titles, bulk listing, competitor scanning. Free plan available.",
    url: "https://www.unicornds.io",
    siteName: "UnicornDS",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnicornDS — eBay Automation Tool",
    description: "Find profitable products on Amazon & AliExpress, list on eBay in seconds.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE_HERE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "UnicornDS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Chrome",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "GBP", name: "Free Trial" },
    { "@type": "Offer", price: "23.99", priceCurrency: "GBP", name: "Starter Plan" },
    { "@type": "Offer", price: "47.99", priceCurrency: "GBP", name: "Growth Plan" },
    { "@type": "Offer", price: "79.99", priceCurrency: "GBP", name: "Empire Plan" },
  ],
  description: "Chrome extension for eBay dropshipping and Amazon arbitrage. Find products, list automatically, manage your store.",
  url: "https://www.unicornds.io",
  publisher: {
    "@type": "Organization",
    name: "UnicornDS",
    url: "https://www.unicornds.io",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is UnicornDS?", "acceptedAnswer": { "@type": "Answer", "text": "UnicornDS is a Chrome browser extension that helps eBay sellers find profitable products on Amazon and AliExpress, then list them on eBay automatically with AI-generated titles, VERO brand checking, and bulk listing capabilities." }},
              { "@type": "Question", "name": "Is UnicornDS free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, UnicornDS offers a 14-day free trial with 100 listings. Paid plans start at £23.99/month for 500 listings (Starter), £47.99 for 1,500 listings (Growth), and £79.99 for 3,000 listings (Empire)." }},
              { "@type": "Question", "name": "How does UnicornDS compare to EcomSniper?", "acceptedAnswer": { "@type": "Answer", "text": "UnicornDS Empire offers 3,000 listings for £79.99/month compared to EcomSniper at $199/month. UnicornDS also includes exclusive features like AI title generation, Stock Checker, VERO protection for 3,390 brands, Smart Order Messages, Check on eBay, Restock tools, and phone auto-capture that EcomSniper does not offer." }},
              { "@type": "Question", "name": "Does UnicornDS work with Amazon and AliExpress?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, UnicornDS supports both Amazon arbitrage (US, UK, DE, AU) and AliExpress dropshipping. You can find products on either platform and list them on any eBay marketplace worldwide." }},
              { "@type": "Question", "name": "What is VERO protection?", "acceptedAnswer": { "@type": "Answer", "text": "VERO (Verified Rights Owner) is eBay's brand protection program. UnicornDS automatically checks every product against 3,390 known VERO brands before listing, preventing account suspensions from intellectual property violations." }},
            ]
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "UnicornDS",
            url: "https://www.unicornds.io",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.unicornds.io/blog?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}}
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
