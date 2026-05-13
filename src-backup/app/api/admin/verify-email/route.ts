import { NextRequest, NextResponse } from "next/server";
import { adminAuth, verifyAdmin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Find user by email
    const user = await adminAuth.getUserByEmail(email);
    
    // Set emailVerified to true
    await adminAuth.updateUser(user.uid, { emailVerified: true });

    return NextResponse.json({ ok: true, uid: user.uid, email: user.email, verified: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
