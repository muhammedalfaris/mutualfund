'use client';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);
  return <>{children}</>;
} 