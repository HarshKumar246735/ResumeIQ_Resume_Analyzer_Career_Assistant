import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // The session lives in an HTTP-only cookie; we only ask the server who we are.
  useEffect(() => {
    authService.fetchMe().then((d) => setUser(d.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (values) => { const d = await authService.login(values); setUser(d.user); }, []);
  const signUp = useCallback(async (values) => { const d = await authService.register(values); setUser(d.user); }, []);
  const signOut = useCallback(async () => { try { await authService.logout(); } finally { setUser(null); } }, []);

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
