import type { PageResult, SysRole } from "../types";
import { request } from "./request";

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
