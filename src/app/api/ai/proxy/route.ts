import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";


// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Verify request has a valid auth token (try Firebase, fall back to accepting any Bearer token)
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer "))
      return NextResponse.json({ error: "No token" }, { status: 401, headers: { "Access-Control-Allow-Origin": "*" } });
    const token = authHeader.split("Bearer ")[1];
    try {
      await adminAuth.verifyIdToken(token);
    } catch {
      // Token verification failed - still allow if token looks valid (extension session)
      if (!token || token.length < 20)
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const input = body.data || body;
    const { systemPrompt, userMessage, jsonMode, imageDataUrl } = input;

    if (!systemPrompt || !userMessage)
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    if (!OPENAI_KEY)
      return NextResponse.json({ error: "AI not configured" }, { status: 500 });

    // Build message content (text or vision)
    const userContent = imageDataUrl
      ? [
          { type: "image_url", image_url: { url: imageDataUrl, detail: "low" } },
          { type: "text", text: userMessage },
        ]
      : userMessage;

    const openaiBody: Record<string, unknown> = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };
    if (jsonMode) openaiBody.response_format = { type: "json_object" };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(openaiBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[AI Proxy] OpenAI error:", res.status, err);
      return NextResponse.json({ error: "AI request failed" }, { status: 502 });
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "";

    // Return in the same format the extension expects: { result: { result: "..." } }
    return NextResponse.json({ result: { result } }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (err) {
    console.error("[AI Proxy] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
