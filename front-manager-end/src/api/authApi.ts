import type { LoginResponse, SysUser } from "../types";
import { request } from "./request";

export function login(username: string, password: string) {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return request<void>("/api/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return request<SysUser>("/api/auth/me");
}
