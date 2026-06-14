import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { clearStoredToken, login as loginRequest, logout as logoutRequest, setStoredToken } from "../api/apiClient";
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
    const raw = localStorage.getItem("knowledge_manager_user");
    return raw ? (JSON.parse(raw) as SysUser) : null;
  });

  async function login(username: string, password: string) {
    const response = await loginRequest(username, password);
    setStoredToken(response.token);
    localStorage.setItem("knowledge_manager_user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      clearStoredToken();
      localStorage.removeItem("knowledge_manager_user");
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
