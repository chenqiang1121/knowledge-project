import type { ApiResult, LoginResponse, PageResult, Permission, Role, User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const TOKEN_KEY = "knowledge_manager_token";
const LOCALE_KEY = "knowledge_locale";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getRequestFailedMessage(status: number) {
  return localStorage.getItem(LOCALE_KEY) === "zh-CN" ? `请求失败，状态码 ${status}` : `Request failed with status ${status}`;
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
    throw new Error(result.message || getRequestFailedMessage(response.status));
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
  return request<User>("/api/auth/me");
}

export function getUsers(pageIndex = 1, pageSize = 20) {
  return request<PageResult<User>>("/api/user/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function saveUser(user: User) {
  const method = user.id ? "PUT" : "POST";
  return request<number>("/api/user", { method, body: JSON.stringify(user) });
}

export function deleteUser(id: number) {
  return request<number>(`/api/user/${id}`, { method: "DELETE" });
}

export function getRoles(pageIndex = 1, pageSize = 100) {
  return request<PageResult<Role>>("/api/role/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function saveRole(role: Role) {
  const method = role.id ? "PUT" : "POST";
  return request<number>("/api/role", { method, body: JSON.stringify(role) });
}

export function deleteRole(id: number) {
  return request<number>(`/api/role/${id}`, { method: "DELETE" });
}

export function getRolePermissions(roleId: number) {
  return request<number[]>(`/api/role/${roleId}/permissions`);
}

export function saveRolePermissions(roleId: number, permissionIds: number[]) {
  return request<number>(`/api/role/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissionIds }),
  });
}

export function getPermissions(pageIndex = 1, pageSize = 100) {
  return request<PageResult<Permission>>("/api/permission/page", {
    method: "POST",
    body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
  });
}

export function getMenuTree() {
  return request<Permission[]>("/api/permission/menu");
}

export function savePermission(permission: Permission) {
  const method = permission.id ? "PUT" : "POST";
  return request<number>("/api/permission", { method, body: JSON.stringify(permission) });
}

export function deletePermission(id: number) {
  return request<number>(`/api/permission/${id}`, { method: "DELETE" });
}
