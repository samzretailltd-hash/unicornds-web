import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.11.2",
      released: "2026-04-23",
      changelog: [
        "Fixed pricing formula duplicated 8 times across 5 files",
        "Variant prices now correctly end in .99",
        "New compliance checker blocks knives, weapons, and unsafe products before listing",
        "Fixed required fields wiped by eBay page reload",
        "Shared pricing module — single source of truth for all fee calculations",
      ],
      downloadUrl: "https://www.unicornds.io/download",
      critical: false, // set true to force-show the banner even if dismissed
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600", // cache 1 hour
      },
    }
  );
}
