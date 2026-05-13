import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { name, email, website, audience, plan } = await req.json();
    if (!name || !email || !plan) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip") || "unknown";

    await adminDb.collection("affiliate_applications").add({
      name,
      email,
      website: website || "",
      audience: audience || "",
      promotion_plan: plan,
      ip,
      status: "pending",
      applied_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
