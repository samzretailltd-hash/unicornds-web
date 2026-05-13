import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account — UnicornDS",
  description: "Create a free UnicornDS account. Start your 14-day eBay dropshipping trial. No credit card required.",
  alternates: { canonical: "https://www.unicornds.io/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
