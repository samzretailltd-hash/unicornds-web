import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.33.0",
      released: "2026-08-27",
      changelog: [
        "Exact Amazon product finder: opens the exact product from an eBay listing, not a keyword search",
        "Reads the product identifier from item specifics and the listing description automatically",
        "New Stock Monitor on active listings: checks Amazon stock and can auto-end out-of-stock items",
        "Fast Tracker now queues out-of-stock listings to end automatically",
        "Safety fix: in-stock items that only fail a rule are never ended",
        "US sourcing more accurate: competitor finder no longer forces Prime-only",
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
