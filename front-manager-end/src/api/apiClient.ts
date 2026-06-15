import type { ApiResult, LoginResponse, PageResult, SysMenu, SysRole, SysUser } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const TOKEN_KEY = "knowledge_manager_token";
const USER_KEY = "knowledge_manager_user";
const LOCALE_KEY = "knowledge_locale";
const AUTH_EXPIRED_EVENT = "knowledge_manager_auth_expired";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function notifyAuthenticationExpired() {
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

export function subscribeAuthenticationExpired(listener: () => void) {
  window.addEventListener(AUTH_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
}

function getRequestFailedMessage(status: number) {
  return localStorage.getItem(LOCALE_KEY) === "zh-CN" ? `请求失败，状态码 ${status}` : `Request failed with status ${status}`;
}

function isAuthenticationFailure(path: string, status: number, message = "") {
  if (path === "/api/auth/login") {
    return false;
  }
  return status === 401 || status === 403 || message.includes("token required") || message.includes("token 无效");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", token);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || !(result.success || result.code === 0)) {
    const message = result.message || getRequestFailedMessage(response.status);
    if (isAuthenticationFailure(path, response.status, message)) {
      clearStoredToken();
      notifyAuthenticationExpired();
      throw new AuthenticationError(message);
    }
    throw new Error(message);
  }
  return result.data;
}

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

export function getSysUsers(pageIndex = 1, pageSize = 20) {
  return request<PageResult<SysUser>>("/api/sys-user/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function saveSysUser(user: SysUser) {
  const method = user.id ? "PUT" : "POST";
  return request<number>("/api/sys-user", { method, body: JSON.stringify(user) });
}

export function deleteSysUser(id: number) {
  return request<number>(`/api/sys-user/${id}`, { method: "DELETE" });
}

export function getSysRoles(pageIndex = 1, pageSize = 100) {
  return request<PageResult<SysRole>>("/api/sys-role/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function saveSysRole(role: SysRole) {
  const method = role.id ? "PUT" : "POST";
  return request<number>("/api/sys-role", { method, body: JSON.stringify(role) });
}

export function deleteSysRole(id: number) {
  return request<number>(`/api/sys-role/${id}`, { method: "DELETE" });
}

export function getSysRoleMenus(sysRoleId: number) {
  return request<number[]>(`/api/sys-role/${sysRoleId}/menus`);
}

export function saveSysRoleMenus(sysRoleId: number, sysMenuIds: number[]) {
  return request<number>(`/api/sys-role/${sysRoleId}/menus`, {
    method: "PUT",
    body: JSON.stringify({ sysMenuIds }),
  });
}

export function getSysMenus(pageIndex = 1, pageSize = 100) {
  return request<PageResult<SysMenu>>("/api/sys-menu/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function getSysMenuTree() {
  return request<SysMenu[]>("/api/sys-menu/tree");
}

export function saveSysMenu(permission: SysMenu) {
  const method = permission.id ? "PUT" : "POST";
  return request<number>("/api/sys-menu", { method, body: JSON.stringify(permission) });
}

export function deleteSysMenu(id: number) {
  return request<number>(`/api/sys-menu/${id}`, { method: "DELETE" });
}
