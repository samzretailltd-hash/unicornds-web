import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.AFFILIATE_JWT_SECRET || "change-me-in-env";
const AFF_COOKIE = "aff_session";
const ADMIN_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export async function verifyPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export function signAffiliate(id: string, email: string) {
  return jwt.sign({ id, email, role: "affiliate" }, SECRET, { expiresIn: "30d" });
}
export function setAffiliateCookie(res: NextResponse, token: string) {
  res.cookies.set(AFF_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: MAX_AGE });
}
export function getAffiliate(req: NextRequest): { id: string; email: string } | null {
  const t = req.cookies.get(AFF_COOKIE)?.value;
  if (!t) return null;
  try { const p = jwt.verify(t, SECRET) as any; if (p.role !== "affiliate") return null; return { id: p.id, email: p.email }; }
  catch { return null; }
}
export function clearAffiliateCookie(res: NextResponse) {
  res.cookies.set(AFF_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function signAdmin() { return jwt.sign({ role: "admin" }, SECRET, { expiresIn: "7d" }); }
export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export function isAdmin(req: NextRequest): boolean {
  const t = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  try { const p = jwt.verify(t, SECRET) as any; return p.role === "admin"; } catch { return false; }
}
export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
