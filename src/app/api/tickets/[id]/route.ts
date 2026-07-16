import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function getUser(req: NextRequest, bodyToken?: string) {
  const h = req.headers.get("authorization");
  let token: string | null = null;
  if (h && h.startsWith("Bearer ")) token = h.split("Bearer ")[1];
  if (!token && bodyToken) token = bodyToken;
  if (!token) return null;
  try { const d = await adminAuth.verifyIdToken(token); return d?.uid ? d : null; } catch { return null; }
}

// ── GET: one ticket + its messages ────────────────────
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  try {
    const doc = await adminDb.collection("tickets").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const t = doc.data() as any;
    if (t.uid !== user.uid) return NextResponse.json({ error: "Not your ticket" }, { status: 403 });

    const msgs = await adminDb.collection("tickets").doc(id).collection("messages").orderBy("createdAt", "asc").get();
    if (t.unreadForUser) await doc.ref.update({ unreadForUser: false });

    return NextResponse.json({
      ticket: { id: doc.id, subject: t.subject, category: t.category, status: t.status, createdAt: t.createdAt },
      messages: msgs.docs.map((m) => ({ id: m.id, ...(m.data() as any) })),
    });
  } catch (err) {
    console.error("Ticket get error:", err);
    return NextResponse.json({ error: "Could not load ticket" }, { status: 500 });
  }
}

// ── POST: customer replies ────────────────────────────
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const user = await getUser(req, body.token);
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const message = String(body.message || "").trim();
    if (!message) return NextResponse.json({ error: "Message is empty." }, { status: 400 });

    const ref = adminDb.collection("tickets").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const t = doc.data() as any;
    if (t.uid !== user.uid) return NextResponse.json({ error: "Not your ticket" }, { status: 403 });
    if (t.status === "closed") return NextResponse.json({ error: "This ticket is closed. Please open a new one." }, { status: 400 });

    const now = new Date().toISOString();
    await ref.collection("messages").add({
      from: "user", authorName: user.name || user.email || "Customer",
      body: message.slice(0, 5000), createdAt: now,
    });
    await ref.update({
      updatedAt: now, lastReplyBy: "user", status: "open",
      unreadForAdmin: true, messageCount: (t.messageCount || 1) + 1,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Ticket reply error:", err);
    return NextResponse.json({ error: "Could not send reply" }, { status: 500 });
  }
}
