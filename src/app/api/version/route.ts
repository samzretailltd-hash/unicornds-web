import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.32.0",
      released: "2026-08-25",
      changelog: [
        "Exact Amazon product finder: reads the ASIN planted on an eBay listing and opens the exact product (not a keyword search)",
        "Reads ASIN from item specifics and the listing description automatically",
        "US marketplace accuracy improved; competitor finder no longer forces Prime-only",
        "Faster, more reliable exact-match sourcing from eBay to Amazon",
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
