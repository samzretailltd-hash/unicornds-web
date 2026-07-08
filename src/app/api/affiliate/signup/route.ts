import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { hashPassword } from "@/lib/affiliateAuth";
import { customAlphabet } from "nanoid";

const genCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, paypalEmail, website, audience } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    const existing = await db.collection("affiliates").where("email", "==", cleanEmail).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "An application with this email already exists." }, { status: 409 });
    }
    let code = genCode();
    for (let i = 0; i < 5; i++) {
      const c = await db.collection("affiliates").where("code", "==", code).limit(1).get();
      if (c.empty) break;
      code = genCode();
    }
    await db.collection("affiliates").add({
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      paypalEmail: paypalEmail ? String(paypalEmail).trim().toLowerCase() : cleanEmail,
      website: website ? String(website).trim() : "",
      audience: audience ? String(audience).trim() : "",
      code,
      tier: "standard",
      status: "pending",        // <-- must be approved before login works
      clicks: 0, conversions: 0, totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0,
      createdAt: new Date().toISOString(),
    });
    // NOTE: no cookie set — applicant cannot log in until you approve.
    return NextResponse.json({ ok: true, pending: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Application failed: " + (e?.message || "unknown") }, { status: 500 });
  }
}
