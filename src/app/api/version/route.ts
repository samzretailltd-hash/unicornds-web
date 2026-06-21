import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.23.0",
      released: "2026-06-21",
      changelog: [
        "New eBay UK restricted-words protection — built-in block-words list (updated 31 May 2026) flags risky words before you list",
        "Catches 1,197 high-risk terms (perfume, batteries, baby items, supplements, tools and more) to cut blocked/removed listings",
        "Two levels: Protective (default) and General, with optional hard-block mode",
        "Faster, single-pass keyword scanning across title and description",
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
