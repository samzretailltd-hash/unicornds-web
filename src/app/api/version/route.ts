import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ version: "7.11.2", released: "2026-04-23", changelog: ["Fixed pricing formula duplicated 8 times", "Variant prices now correctly end in .99", "Compliance checker blocks knives and weapons", "Fixed required fields wiped by eBay reload"], downloadUrl: "https://www.unicornds.io/download", critical: false }, { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}
// force rebuild
