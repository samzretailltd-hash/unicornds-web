import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      version: "7.11.2",
      released: "2026-04-23",
      changelog: [
        "Fixed pricing formula duplicated 8 times across 5 files",
        "Variant prices now correctly end in .99",
        "New compliance checker blocks knives, weapons, and unsafe products",
        "Fixed required fields wiped by eBay page reload",
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
