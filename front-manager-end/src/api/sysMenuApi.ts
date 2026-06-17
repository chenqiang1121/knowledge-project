import type { PageResult, SysMenu } from "../types";
import { request } from "./request";

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
