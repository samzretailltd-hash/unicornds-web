import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — UnicornDS",
  description: "Sign in to your UnicornDS account to manage your eBay dropshipping subscription.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
