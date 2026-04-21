import { NextRequest, NextResponse } from "next/server";
import { adminDb, verifyAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req.headers.get("authorization"));
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersSnap = await adminDb.collection("users").get();
    let total = 0, free = 0, starter = 0, growth = 0, empire = 0;
    usersSnap.docs.forEach(doc => { total++; const t = doc.data().tier || "free"; if(t==="free")free++; else if(t==="starter")starter++; else if(t==="growth")growth++; else if(t==="empire")empire++; });

    // Only owners see payment data
    let payments: unknown[] = [];
    let revenue = 0;
    if (admin.role === "owner") {
      const paymentsSnap = await adminDb.collection("payments").orderBy("received_at", "desc").limit(50).get();
      payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      revenue = payments.filter((p: any) => p.status === "completed").reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
    }

    return NextResponse.json({
      role: admin.role,
      users: { total, free, starter, growth, empire },
      payments: admin.role === "owner" ? payments.slice(0, 20) : [],
      revenue: { total: admin.role === "owner" ? revenue : -1, currency: "GBP" },
    });
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
}
