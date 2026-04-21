'use client';
import { useEffect, useCallback, useRef } from 'react';

const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function AutoLogout() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    try {
      const { getAuth, signOut } = await import('firebase/auth');
      const { initializeApp, getApps } = await import('firebase/app');
      
      const firebaseConfig = {
        apiKey: "AIzaSyCOLnljoCmGWKCseXTSJv0zYVJhLUGVhN4",
        authDomain: "unicorn-ds-7f831.firebaseapp.com",
        projectId: "unicorn-ds-7f831",
      };

      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      
      if (auth.currentUser) {
        await signOut(auth);
        window.location.href = '/login?reason=inactive';
      }
    } catch (e) {
      console.warn('Auto-logout error:', e);
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, INACTIVE_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return null;
}
