import type { LoginResponse, SysUser } from "../types";
import { ApiClient, AuthenticationError } from "./apiClient";

export class AuthApi {
  static login(username: string, password: string) {
    return ApiClient.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  static logout() {
    return ApiClient.request<void>("/api/auth/logout", { method: "POST" });
  }

  static getCurrentUser() {
    return ApiClient.request<SysUser>("/api/auth/me");
  }

  static isAuthenticationError(error: unknown) {
    return error instanceof AuthenticationError;
  }
}
