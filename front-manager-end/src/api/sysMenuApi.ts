import type { PageResult, SysMenu } from "../types";
import { ApiClient } from "./apiClient";

export class SysMenuApi {
  static getSysMenus(pageIndex = 1, pageSize = 100) {
    return ApiClient.request<PageResult<SysMenu>>("/api/sys-menu/page", {
      method: "POST",
      body: JSON.stringify({ pageIndex, pageSize, isDel: false }),
    });
  }

  static getSysMenuTree() {
    return ApiClient.request<SysMenu[]>("/api/sys-menu/tree");
  }

  static saveSysMenu(permission: SysMenu) {
    const method = permission.id ? "PUT" : "POST";
    return ApiClient.request<number>("/api/sys-menu", { method, body: JSON.stringify(permission) });
  }

  static deleteSysMenu(id: number) {
    return ApiClient.request<number>(`/api/sys-menu/${id}`, { method: "DELETE" });
  }
}
