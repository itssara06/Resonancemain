'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthInit({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!loading && isAuthenticated && user && !user.isOnboarded && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding');
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return null; // Or a full screen loader if preferred
  }

  // Prevent rendering if they need to be redirected to onboarding
  if (!loading && isAuthenticated && user && !user.isOnboarded && !pathname.startsWith('/onboarding')) {
    return null;
  }

  return <>{children}</>;
}
