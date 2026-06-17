import type { PageResult, SysRole } from "../types";
import { ApiClient } from "./apiClient";

export class SysRoleApi {
  static getSysRoles(pageIndex = 1, pageSize = 100) {
    return ApiClient.request<PageResult<SysRole>>("/api/sys-role/page", {
      method: "POST",
      body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
    });
  }

  static saveSysRole(role: SysRole) {
    const method = role.id ? "PUT" : "POST";
    return ApiClient.request<number>("/api/sys-role", { method, body: JSON.stringify(role) });
  }

  static deleteSysRole(id: number) {
    return ApiClient.request<number>(`/api/sys-role/${id}`, { method: "DELETE" });
  }

  static getSysRoleMenus(sysRoleId: number) {
    return ApiClient.request<number[]>(`/api/sys-role/${sysRoleId}/menus`);
  }

  static saveSysRoleMenus(sysRoleId: number, sysMenuIds: number[]) {
    return ApiClient.request<number>(`/api/sys-role/${sysRoleId}/menus`, {
      method: "PUT",
      body: JSON.stringify({ sysMenuIds }),
    });
  }
}
