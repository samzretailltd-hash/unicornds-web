import { NextResponse } from "next/server";

// Public endpoint — no auth required
// The extension checks this every 24h to see if a new version is available
export async function GET() {
  return NextResponse.json(
    {
      version: "7.24.0",
      released: "2026-07-15",
      changelog: [
        "US marketplace fully supported — prices, currency and Amazon links now follow your Primary Market instead of defaulting to the UK",
        "Fixed VERO false positives — products like 'Mac mini dock' or 'camera' are no longer wrongly blocked, while real protected brands still are",
        "Fixed £0 price errors on newer Amazon product pages",
        "Out-of-stock and low-stock products are now skipped automatically when bulk listing (Amazon + Walmart)",
        "Stock detection now works in English, German, French, Spanish, Italian and Dutch",
        "5 new markets added: Netherlands, Ireland, Austria, Belgium and Switzerland — each with correct currency, language and carrier",
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
