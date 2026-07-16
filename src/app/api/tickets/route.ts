import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const CATEGORIES = ["support", "billing", "technical", "feature", "other"];

async function getUser(req: NextRequest, bodyToken?: string) {
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.split("Bearer ")[1];
  if (!token && bodyToken) token = bodyToken;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded?.uid ? decoded : null;
  } catch { return null; }
}

// ── GET: list my tickets ──────────────────────────────
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const snap = await adminDb.collection("tickets")
      .where("uid", "==", user.uid)
      .orderBy("updatedAt", "desc")
      .limit(50)
      .get();
    const tickets = snap.docs.map((d) => {
      const t = d.data() as any;
      return {
        id: d.id, subject: t.subject, category: t.category, status: t.status,
        priority: t.priority, createdAt: t.createdAt, updatedAt: t.updatedAt,
        lastReplyBy: t.lastReplyBy, messageCount: t.messageCount || 1,
        unreadForUser: !!t.unreadForUser,
      };
    });
    return NextResponse.json({ tickets });
  } catch (err: any) {
    console.error("Ticket list error:", err);
    return NextResponse.json({ error: "Could not load tickets" }, { status: 500 });
  }
}

// ── POST: create a ticket ─────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getUser(req, body.token);
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const category = CATEGORIES.includes(body.category) ? body.category : "support";
    if (!subject || subject.length < 3) return NextResponse.json({ error: "Please enter a subject." }, { status: 400 });
    if (!message || message.length < 10) return NextResponse.json({ error: "Please describe your issue (at least 10 characters)." }, { status: 400 });

    // simple rate limit: max 5 open tickets
    const openSnap = await adminDb.collection("tickets")
      .where("uid", "==", user.uid).where("status", "in", ["open", "pending"]).get();
    if (openSnap.size >= 5) {
      return NextResponse.json({ error: "You already have 5 open tickets. Please wait for a reply." }, { status: 429 });
    }

    // pull tier for admin context
    let tier = "free";
    try {
      const u = await adminDb.collection("users").doc(user.uid).get();
      if (u.exists) tier = u.data()?.tier || "free";
    } catch {}

    const now = new Date().toISOString();
    const ref = await adminDb.collection("tickets").add({
      uid: user.uid,
      email: user.email || "",
      name: user.name || (user.email || "").split("@")[0],
      tier,
      subject: subject.slice(0, 140),
      category,
      priority: category === "billing" ? "high" : "normal",
      status: "open",
      createdAt: now,
      updatedAt: now,
      lastReplyBy: "user",
      messageCount: 1,
      unreadForAdmin: true,
      unreadForUser: false,
    });
    await ref.collection("messages").add({
      from: "user", authorName: user.name || user.email || "Customer",
      body: message.slice(0, 5000), createdAt: now,
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err: any) {
    console.error("Ticket create error:", err);
    return NextResponse.json({ error: "Could not create ticket" }, { status: 500 });
  }
}
