'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasPassword, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!loading && isAuthenticated && !hasPassword && pathname !== '/setup-password') {
      router.push('/setup-password');
    }
  }, [isAuthenticated, hasPassword, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasPassword && pathname !== '/setup-password') {
    return null;
  }

  return <>{children}</>;
}
