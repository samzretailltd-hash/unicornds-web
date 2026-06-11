import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export type AdminRole = "owner" | "support";

interface AdminUser {
  email: string;
  role: AdminRole;
  name: string;
}

const ADMIN_USERS: AdminUser[] = [
  { email: "1stunicorndistribution@gmail.com", role: "owner", name: "Zohaib (Owner)" },
  { email: "zohaib219@gmail.com", role: "owner", name: "Zohaib (Personal)" },
  // Add junior staff here — they can see users and settings but NOT payments or revenue
  // { email: "junior1@gmail.com", role: "support", name: "Junior Staff 1" },
  // { email: "junior2@gmail.com", role: "support", name: "Junior Staff 2" },
];

const ADMIN_EMAILS = ADMIN_USERS.map(u => u.email);

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;
  return initializeApp(
    serviceAccount
      ? { credential: cert(serviceAccount), projectId: "unicorn-ds-7f831" }
      : { projectId: "unicorn-ds-7f831" }
  );
}

const app = getAdminApp();
export const adminDb = getFirestore(app);
// Firestore throws on undefined field values by default; ignore them so a single
// optional/undefined field can never crash a write (e.g. Stripe webhook upgrades).
try { adminDb.settings({ ignoreUndefinedProperties: true }); } catch { /* settings can only be set once */ }
export const adminAuth = getAuth(app);

export async function verifyAdmin(authHeader: string | null): Promise<{ uid: string; email: string; role: AdminRole; name: string } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const adminUser = ADMIN_USERS.find(u => u.email === decoded.email);
    if (!adminUser) return null;
    return { uid: decoded.uid, email: decoded.email!, role: adminUser.role, name: adminUser.name };
  } catch {
    return null;
  }
}

export { ADMIN_EMAILS, ADMIN_USERS };
