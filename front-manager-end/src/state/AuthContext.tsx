import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredToken,
  getStoredUser,
  login as loginRequest,
  logout as logoutRequest,
  setStoredToken,
  setStoredUser,
  subscribeAuthenticationExpired,
} from "../api/apiClient";
import type { SysUser } from "../types";

interface AuthContextValue {
  user: SysUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("knowledge_manager_token"));
  const [user, setUser] = useState<SysUser | null>(() => {
    const raw = getStoredUser();
    return raw ? (JSON.parse(raw) as SysUser) : null;
  });

  useEffect(() => {
    return subscribeAuthenticationExpired(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  async function login(username: string, password: string) {
    const response = await loginRequest(username, password);
    setStoredToken(response.token);
    setStoredUser(response.user);
    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearStoredToken();
      setToken(null);
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
