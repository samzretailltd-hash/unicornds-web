import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.21.0",
      released: "2026-06-21",
      changelog: [
        "Walmart variations + strict Walmart-only sourcing, plus Order Manager fixes (delivered status, full imports, accurate earnings)",
        "Walmart — size/colour/style variations now import with per-variant prices and images",
        "Walmart — strict mode lists only items sold & shipped by Walmart.com (skips third-party sellers)",
        "Multi-currency support — correct symbols and decimals for €, $, CHF and C$",
        "Native-language listings — titles and descriptions written in the marketplace language",
        "Order Manager — delivered orders show correctly, all orders import, earnings captured accurately",
      ],
      downloadUrl: "https://www.unicornds.io/download",
      critical: false,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
