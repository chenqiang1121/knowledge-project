import type { ApiResult } from "../types";
import { clearStoredToken, getStoredToken, notifyAuthenticationExpired } from "./authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const LOCALE_KEY = "knowledge_locale";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
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

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
