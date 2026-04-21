import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — UnicornDS",
  description: "Your UnicornDS dashboard. Manage listings, view usage, and access tools.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
