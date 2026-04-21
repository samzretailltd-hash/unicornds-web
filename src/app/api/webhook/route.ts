import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("revolut-signature") || "";
    const secret = process.env.REVOLUT_WEBHOOK_SECRET;
    if (secret && sig) {
      const expected = createHmac("sha256", secret).update(body).digest("hex");
      if (sig !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    const event = JSON.parse(body);
    const fnUrl = process.env.CLOUD_FUNCTION_URL || "https://us-central1-unicorn-ds-7f831.cloudfunctions.net/revolutWebhook";
    const res = await fetch(fnUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) });
    return NextResponse.json({ received: true, forwarded: res.ok });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
