import type { Metadata } from 'next';
import { FeaturePageLayout } from '@/components/FeaturePageLayout';

export const metadata: Metadata = {
  title: 'Cassini SEO Titles — AI-Generated eBay Titles That Rank #1',
  description: 'GPT-4o generates eBay titles optimised for Cassini search algorithm. Buyer keywords, not AliExpress jargon. 80 characters, keyword-rich, no banned words.',
  keywords: ['ebay cassini seo', 'ai ebay title generator', 'ebay seo title tool', 'cassini algorithm optimisation', 'ebay title builder ai'],
};

export default function AiTitlesPage() {
  return (
    <FeaturePageLayout
      badge="AI SEO"
      badgeColor="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20"
      title="Cassini SEO Titles"
      subtitle="AI titles that think like an eBay buyer, not a Chinese supplier."
      heroDescription="Your eBay title is the single most important factor for search visibility. eBay's Cassini algorithm weights the first 3 words heaviest, rewards keyword consistency between title and description, and penalises repetition and filler words. UnicornDS uses GPT-4o to generate titles that follow all of these rules. It analyses the product (including the image), identifies what real eBay buyers would type to find it, generates 3 title variants, scores each one, and picks the best. The result: titles like 'Car Phone Holder - Dashboard Mount for iPhone Samsung - 360 Rotation' instead of 'Hot Sale Universal Suction Cup Cell Phone Windshield Dashboard Mount Bracket 2024'."
      screenshotAlt="UnicornDS AI title generation showing 3 title variants with scores"
      sections={[
        { icon: '🧠', title: 'GPT-4o Powered', description: 'Uses the same AI model as ChatGPT Plus. Not a keyword template — real language model that understands products and buyer intent.' },
        { icon: '🔍', title: 'Buyer Keyword Research', description: 'Analyses what eBay buyers actually type: "car phone holder" not "suction cup cell phone windshield mount". First 3 words optimised for Cassini.' },
        { icon: '📐', title: 'Full 80 Characters', description: 'Every character of eBay\'s 80-character title limit is used for SEO value. No wasted space on filler words like "Hot Sale" or "Best Quality".' },
        { icon: '📊', title: '3 Variants, Scored', description: 'Generates 3 different title angles, scores each on keyword coverage, click appeal, and Cassini potential. Automatically picks the highest scorer.' },
        { icon: '👁️', title: 'Vision-Powered', description: 'The AI sees the product image — not just the text description. If the AliExpress title says "bracket" but the image shows a phone holder, the AI knows.' },
        { icon: '🌍', title: 'Multi-Language', description: 'For non-English markets, titles are written in the local language. German titles for eBay.de, French for eBay.fr — natural, not Google Translate.' },
      ]}
      howItWorks={[
        'When you list a product (single or bulk), the AI analyses the product data AND the product image to understand what it actually is.',
        'It identifies buyer keywords — the words a real eBay buyer would type to find this product, not the words a Chinese supplier uses.',
        'Three title variants are generated with different keyword angles. Each is scored on Cassini ranking potential, click appeal, and character usage.',
        'The highest-scoring title is automatically selected. If it needs truncation, dangling words like "for" or "with" are cleaned up.',
        'Keywords from the title are fed into the description generator for Cassini keyword consistency — the #2 ranking signal after title relevance.',
      ]}
      ctaText="Get AI-powered titles"
    />
  );
}
