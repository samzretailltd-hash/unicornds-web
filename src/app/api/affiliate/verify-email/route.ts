import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// Public: check if an email belongs to an APPROVED affiliate (used by /affiliate/signup)
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ approved: false, error: "Email required" }, { status: 400 });

    const snap = await adminDb.collection("affiliate_applications")
      .where("email", "==", email.trim().toLowerCase())
      .where("status", "==", "approved")
      .limit(1)
      .get();

    if (snap.empty) {
      // also try exact (non-lowercased) in case applications stored mixed case
      const snap2 = await adminDb.collection("affiliate_applications")
        .where("email", "==", email.trim())
        .where("status", "==", "approved")
        .limit(1)
        .get();
      if (snap2.empty) {
        return NextResponse.json({ approved: false });
      }
      return NextResponse.json({ approved: true, name: snap2.docs[0].data().name || "" });
    }

    return NextResponse.json({ approved: true, name: snap.docs[0].data().name || "" });
  } catch (err) {
    return NextResponse.json({ approved: false, error: String(err) }, { status: 500 });
  }
}
