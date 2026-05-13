import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account — UnicornDS",
  description: "Create a free UnicornDS account. Start your 7-day eBay dropshipping trial for £1. Card required for £1 trial.",
  alternates: { canonical: "https://www.unicornds.io/signup" },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
