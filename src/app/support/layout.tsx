import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UnicornDS Support — Help, FAQs & AI Chatbot",
  description: "Get help with UnicornDS. AI-powered chatbot answers eBay dropshipping questions 24/7. Contact: hello@unicornds.io.",
  alternates: { canonical: "https://www.unicornds.io/support" },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
