import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UnicornDS Handbook — Complete User Guide",
  description: "The complete guide to using UnicornDS. Learn every feature from signup to bulk listing, competitor scanning, AI titles, and more.",
  robots: "noindex, nofollow",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
