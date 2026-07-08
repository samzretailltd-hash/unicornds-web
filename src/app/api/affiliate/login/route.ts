import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebase-admin";
import { verifyPassword, signAffiliate, setAffiliateCookie } from "@/lib/affiliateAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const snap = await db.collection("affiliates").where("email", "==", cleanEmail).limit(1).get();
    if (snap.empty) return NextResponse.json({ error: "No application found with this email." }, { status: 404 });
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    const ok = await verifyPassword(password, data.passwordHash || "");
    if (!ok) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

    if (data.status === "pending") {
      return NextResponse.json({ error: "Your application is still under review. We'll email you once approved." }, { status: 403 });
    }
    if (data.status === "rejected") {
      return NextResponse.json({ error: "Your application was not approved." }, { status: 403 });
    }
    if (data.status === "suspended") {
      return NextResponse.json({ error: "This account is suspended. Contact support." }, { status: 403 });
    }
    const token = signAffiliate(docSnap.id, cleanEmail);
    const res = NextResponse.json({ ok: true });
    setAffiliateCookie(res, token);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: "Login failed: " + (e?.message || "unknown") }, { status: 500 });
  }
}
