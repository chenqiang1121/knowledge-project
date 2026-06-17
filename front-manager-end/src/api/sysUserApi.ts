import type { PageResult, SysUser } from "../types";
import { request } from "./request";

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
