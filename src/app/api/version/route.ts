import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.12.1",
      released: "2026-05-02",
      changelog: [
        "Order Manager — buyer names now show correctly (was showing order IDs)",
        "Full order sync — scrapes ALL orders across multiple pages (up to 900+)",
        "Estimated earnings — calculates eBay fees using your actual promo rate",
        "Fetch Exact Earnings — new button scrapes real earnings from each order detail page",
        "Export/Import Excel — download orders as CSV, edit in Excel, re-import",
        "Date filters — 7, 30, 90 days and custom range with full data",
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
