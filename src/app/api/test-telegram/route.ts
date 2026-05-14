import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendTelegram } from "@/lib/brevo";

// Admin-only test endpoint to verify Telegram is working
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // Only allow admin emails
    const adminEmails = ["1stunicorndistribution@gmail.com", "zohaib219@gmail.com"];
    if (!adminEmails.includes(decoded.email || ""))
      return NextResponse.json({ error: "Not admin" }, { status: 403 });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Check if env vars exist
    if (!botToken || !chatId) {
      return NextResponse.json({
        ok: false,
        error: "Telegram env vars missing",
        has_token: !!botToken,
        has_chat_id: !!chatId,
      });
    }

    // Try sending a test message
    const result = await sendTelegram(
      `✅ <b>Telegram test successful!</b>\n🕐 ${new Date().toISOString()}\n👤 ${decoded.email}\n\nAll alerts are working.`
    );

    return NextResponse.json({
      ok: true,
      has_token: true,
      has_chat_id: true,
      token_preview: botToken.slice(0, 8) + "...",
      chat_id_preview: chatId.slice(0, 5) + "...",
      send_result: result,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
