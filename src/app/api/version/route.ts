import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.23.7",
      released: "2026-06-21",
      changelog: [
        "EU/FR variations now list correctly — creates your own variation attribute and adds every supplier option (works on FR, DE, ES, IT)",
        "EU prices use the correct comma decimal (12,99 \u20AC) so they are no longer read as inflated amounts",
        "Cleaner item specifics — no more duplicate attributes on non-UK markets",
        "Fixed AI description occasionally showing raw code and line-break characters",
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
