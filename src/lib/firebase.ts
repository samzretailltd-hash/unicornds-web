import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCOLnljoCmGWKCseXTSJv0zYVJhLUGVhN4",
  authDomain: "unicorn-ds-7f831.firebaseapp.com",
  projectId: "unicorn-ds-7f831",
  storageBucket: "unicorn-ds-7f831.appspot.com",
  messagingSenderId: "1098765432",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
