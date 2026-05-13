'use client';
import { GeoProvider } from '@/lib/geo';
import { AutoLogout } from '@/components/AutoLogout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GeoProvider>
      <AutoLogout />
      {children}
    </GeoProvider>
  );
}
