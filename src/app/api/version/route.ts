import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.22.0",
      released: "2026-06-21",
      changelog: [
        "Smarter eBay descriptions — spec tables, a 'why buy from us' comparison, FAQ, and localized support per marketplace",
        "Structured, mobile-first description layout proven to lift conversion",
        "Localized trust & support row in the buyer's language (UK, US, DE, FR, IT, ES and more)",
        "Built-in eBay compliance guard strips banned content automatically",
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
