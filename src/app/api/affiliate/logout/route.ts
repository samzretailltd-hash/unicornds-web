import { NextResponse } from "next/server";
import { clearAffiliateCookie } from "@/lib/affiliateAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAffiliateCookie(res);
  return res;
}
