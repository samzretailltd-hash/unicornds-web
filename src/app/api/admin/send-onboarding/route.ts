import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendOnboardingInvite } from "@/lib/brevo";

const ADMIN_EMAILS = ["samzretailltd@gmail.com"];

export async function POST(req: NextRequest) {
  try {
    // Verify admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAILS.includes(decoded.email || "")) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

    // Get all users from Firestore
    const usersSnap = await adminDb.collection("users").get();
    const results: { email: string; name: string; status: string }[] = [];

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const email = data.email || "";
      const name = data.fullName || "";

      if (!email) {
        results.push({ email: doc.id, name, status: "skipped — no email" });
        continue;
      }

      // Skip admin
      if (ADMIN_EMAILS.includes(email)) {
        results.push({ email, name, status: "skipped — admin" });
        continue;
      }

      // Skip if already sent onboarding email
      if (data.onboarding_email_sent) {
        results.push({ email, name, status: "skipped — already sent" });
        continue;
      }

      try {
        const sent = await sendOnboardingInvite(email, name);
        if (sent) {
          // Mark as sent so we don't send again
          await adminDb.collection("users").doc(doc.id).set({
            onboarding_email_sent: true,
            onboarding_email_sent_at: new Date().toISOString(),
          }, { merge: true });
          results.push({ email, name, status: "✅ sent" });
        } else {
          results.push({ email, name, status: "❌ failed to send" });
        }
      } catch (e: any) {
        results.push({ email, name, status: `❌ error: ${e.message}` });
      }

      // Small delay between emails to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }

    return NextResponse.json({ ok: true, total: results.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
