import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, verifyAdmin } from "@/lib/firebase-admin";

async function requireAdmin(req: NextRequest, bodyToken?: string) {
  const h = req.headers.get("authorization");
  let token: string | null = null;
  if (h && h.startsWith("Bearer ")) token = h.split("Bearer ")[1];
  if (!token && bodyToken) token = bodyToken;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const admin = await verifyAdmin(`Bearer ${token}`);
    return admin ? { decoded, admin } : null;
  } catch { return null; }
}

// ── GET: all tickets (optional ?status=open) ──────────
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth) return NextResponse.json({ error: "Not admin" }, { status: 403 });
  try {
    const status = req.nextUrl.searchParams.get("status");
    const id = req.nextUrl.searchParams.get("id");

    // single ticket + messages
    if (id) {
      const doc = await adminDb.collection("tickets").doc(id).get();
      if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const msgs = await adminDb.collection("tickets").doc(id).collection("messages").orderBy("createdAt", "asc").get();
      if (doc.data()?.unreadForAdmin) await doc.ref.update({ unreadForAdmin: false });
      return NextResponse.json({
        ticket: { id: doc.id, ...(doc.data() as any) },
        messages: msgs.docs.map((m) => ({ id: m.id, ...(m.data() as any) })),
      });
    }

    let q: any = adminDb.collection("tickets");
    if (status && status !== "all") q = q.where("status", "==", status);
    const snap = await q.orderBy("updatedAt", "desc").limit(100).get();
    const tickets = snap.docs.map((d: any) => {
      const t = d.data();
      return {
        id: d.id, subject: t.subject, email: t.email, name: t.name, tier: t.tier,
        category: t.category, status: t.status, priority: t.priority,
        createdAt: t.createdAt, updatedAt: t.updatedAt, lastReplyBy: t.lastReplyBy,
        messageCount: t.messageCount || 1, unreadForAdmin: !!t.unreadForAdmin,
      };
    });
    const counts = { open: 0, pending: 0, resolved: 0, closed: 0 } as any;
    const all = await adminDb.collection("tickets").get();
    all.docs.forEach((d) => { const s = d.data().status; if (counts[s] != null) counts[s]++; });
    return NextResponse.json({ tickets, counts });
  } catch (err) {
    console.error("Admin ticket list error:", err);
    return NextResponse.json({ error: "Could not load tickets" }, { status: 500 });
  }
}

// ── POST: admin reply ─────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = await requireAdmin(req, body.token);
    if (!auth) return NextResponse.json({ error: "Not admin" }, { status: 403 });
    const { id, message } = body;
    if (!id || !String(message || "").trim()) return NextResponse.json({ error: "id and message required" }, { status: 400 });

    const ref = adminDb.collection("tickets").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const now = new Date().toISOString();
    await ref.collection("messages").add({
      from: "admin", authorName: auth.admin.name || "UnicornDS Support",
      body: String(message).slice(0, 5000), createdAt: now,
    });
    await ref.update({
      updatedAt: now, lastReplyBy: "admin", status: "pending",
      unreadForUser: true, unreadForAdmin: false,
      messageCount: (doc.data()?.messageCount || 1) + 1,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin reply error:", err);
    return NextResponse.json({ error: "Could not send reply" }, { status: 500 });
  }
}

// ── PATCH: change status/priority ─────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = await requireAdmin(req, body.token);
    if (!auth) return NextResponse.json({ error: "Not admin" }, { status: 403 });
    const { id, status, priority } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const update: any = { updatedAt: new Date().toISOString() };
    if (status && ["open", "pending", "resolved", "closed"].includes(status)) update.status = status;
    if (priority && ["low", "normal", "high", "urgent"].includes(priority)) update.priority = priority;
    await adminDb.collection("tickets").doc(id).update(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin patch error:", err);
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}
