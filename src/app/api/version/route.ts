import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.25.9",
      released: "2026-08-01",
      changelog: [
        "Order Manager now syncs ALL your eBay orders (fixed a merge bug that collapsed repeat-item sales into one row)",
        "Correct dispatch status: TO DISPATCH with deadline date, LATE orders in red, SHIPPED only when actually dispatched",
        "Fixed buyer names showing as ID numbers, and removed a tracking-number display glitch",
        "New 'Fetch All Earnings' and 'Fetch Earnings for Selected' buttons",
        "Amazon variations: out-of-stock and third-party variants are now filtered out before listing",
        "US marketplace fully supported; 5 new markets (NL, IE, AT, BE, CH)",
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
