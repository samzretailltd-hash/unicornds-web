import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.23.13",
      released: "2026-06-21",
      changelog: [
        "EU/FR variations now list fully end-to-end — SKU, EAN, quantity, price and photos all filled correctly",
        "EAN: now writes \"Does not apply\" per variation row so EU listings stop being rejected",
        "Fixed item specifics defaulting to the wrong value (e.g. country showing \"Afghanistan\") — country now defaults to China where unknown",
        "EU prices use the correct comma decimal (12,99 \u20AC) so they are no longer read as inflated amounts",
        "Cleaner item specifics and AI descriptions; removed leftover code for a lighter extension",
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
