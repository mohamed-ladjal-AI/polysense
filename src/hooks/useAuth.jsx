import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'polysense_user';

export const demoCredentials = {
  email: 'operator@polysense.industrial',
  password: 'sensor123',
};

function formatName(raw) {
  return raw
    .split(/[._\-]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      throw new Error('Enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const nextUser = {
      email: trimmed,
      displayName: formatName(trimmed.split('@')[0]),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}