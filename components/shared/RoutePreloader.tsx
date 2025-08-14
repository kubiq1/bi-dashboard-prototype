'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all main routes on app load
    const routes = ['/cluster-info', '/projects'];
    
    routes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  // This component doesn't render anything
  return null;
}
