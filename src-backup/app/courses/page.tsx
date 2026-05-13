import type { Metadata } from "next";
export const metadata: Metadata = { title: "Video Courses — UnicornDS" };
export default function Courses() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-4">Video Courses</h1>
      <p className="text-[#a5a0cc] mb-8">Learn eBay dropshipping and Amazon arbitrage from our expert tutorials.</p>
      <div className="bg-[#1E1B4B]/50 border border-[#3d3580] rounded-xl p-12">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
        <p className="text-sm text-[#a5a0cc]">Our video course platform is launching soon. Sign up for UnicornDS to get early access.</p>
      </div>
    </div>
  );
}
