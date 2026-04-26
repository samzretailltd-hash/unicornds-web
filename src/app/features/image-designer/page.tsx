import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Image Designer — Professional eBay Product Images in Seconds',
  description: 'Branded product images with templates, watermarks, and overlays. Auto-upload up to 8 high-resolution images from Amazon or AliExpress.',
  keywords: ['ebay product images', 'ebay image editor', 'product image designer', 'ebay listing images', 'professional ebay photos'],
};

export default function ImageDesignerPage() {
  return (
    <FeaturePageLayout
      badge="DESIGN"
      badgeColor="bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/20"
      title="Image Designer"
      subtitle="Professional product images that get more clicks. No design skills needed."
      heroDescription="eBay images directly affect your click-through rate — and Cassini tracks that as a ranking signal. Blurry, generic images get scrolled past. Clean, branded images get clicked. UnicornDS automatically grabs up to 8 high-resolution product images from the source (Amazon or AliExpress) and uploads them directly to your eBay listing. For extra impact, the Image Designer lets you add your store branding: watermarks, borders, logo overlays, and text callouts. Stand out from the dozens of other sellers listing the same product with the same generic images."
      screenshotAlt="UnicornDS Image Designer showing branded product images with watermark and overlay"
      sections={[
        { icon: '📸', title: 'Auto Image Scraping', description: 'Up to 8 high-resolution images automatically scraped from the source product page. Gallery images, variant images, and lifestyle shots.' },
        { icon: '⬆️', title: 'Direct Upload', description: 'Images are uploaded directly to eBay — no need to download them to your computer first. Saves time and disk space.' },
        { icon: '🎨', title: 'Brand Templates', description: 'Add your store name, logo, or branded border to every image. Consistent branding across all your listings.' },
        { icon: '💧', title: 'Watermark Protection', description: 'Add subtle watermarks to prevent competitors from stealing your product photos.' },
        { icon: '🖼️', title: 'Smart Selection', description: 'Automatically filters out duplicate images, tiny thumbnails, and description images. Only clean product photos make it to your listing.' },
        { icon: '📱', title: 'Mobile Optimised', description: 'Images are optimised for mobile viewing — the right dimensions and quality for how most eBay buyers browse.' },
      ]}
      howItWorks={[
        'When you list a product (single or bulk), UnicornDS scrapes all product images from the source page.',
        'Smart filtering removes duplicates, tiny thumbnails, and description-embedded images. Only clean product shots remain.',
        'Images are uploaded directly to your eBay listing — up to 8 per product, in high resolution.',
        'Optionally, use Image Designer to add branding: watermarks, borders, logo overlays, or text callouts.',
        'Your listing goes live with professional images that stand out from competitors using the same generic photos.',
      ]}
      ctaText="Make your listings stand out"
    />
  );
}
