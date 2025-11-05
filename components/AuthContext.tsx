'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthUser = {
  id: string;
  name: string;
  role: 'admin' | 'user';
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  loginWithPassword: (password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'auth.simple.token.v1';
const USER_KEY = 'auth.simple.user.v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem(STORAGE_KEY);
      const rawUser = localStorage.getItem(USER_KEY);
      if (token && rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch {}
    setLoading(false);
  }, []);

  const loginWithPassword = useCallback(async (password: string): Promise<void> => {
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    const ok = password === expected;
    if (ok) {
      const u: AuthUser = { id: 'local-admin', name: 'Administrator', role: 'admin' };
      try {
        localStorage.setItem(STORAGE_KEY, 'ok');
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch {}
      setUser(u);
      router.push('/admin');
    } else {
      throw new Error('Invalid password');
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    setUser(null);
    router.push('/');
  }, [router]);

  const value = useMemo(() => ({ user, loading, loginWithPassword, logout }), [user, loading, loginWithPassword, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
