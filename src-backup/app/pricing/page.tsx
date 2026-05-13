import { PricingSection } from "@/components/PricingSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — UnicornDS Plans from £23.99/mo",
  description: "Simple pricing for eBay dropshipping tools. Free trial, £23.99 Starter, £47.99 Growth, £79.99 Empire. Cancel anytime. 14-day free trial on all plans.",
  alternates: { canonical: "https://www.unicornds.io/pricing" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "UnicornDS Chrome Extension",
  description: "Chrome extension for eBay dropshipping from Amazon and AliExpress. AI titles, VERO protection, bulk listing, stock checker.",
  brand: { "@type": "Brand", name: "UnicornDS" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "0",
    highPrice: "79.99",
    offerCount: 4,
    offers: [
      
      { "@type": "Offer", name: "Starter", price: "23.99", priceCurrency: "GBP", url: "https://www.unicornds.io/pricing" },
      { "@type": "Offer", name: "Growth", price: "47.99", priceCurrency: "GBP", url: "https://www.unicornds.io/pricing" },
      { "@type": "Offer", name: "Empire", price: "79.99", priceCurrency: "GBP", url: "https://www.unicornds.io/pricing" },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="pt-20">
        <PricingSection />
      </div>
    </>
  );
}
