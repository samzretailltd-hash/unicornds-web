import { NextRequest, NextResponse } from "next/server";
import { signAdmin, setAdminCookie } from "@/lib/affiliateAuth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set on server." }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong admin password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  setAdminCookie(res, signAdmin());
  return res;
}
