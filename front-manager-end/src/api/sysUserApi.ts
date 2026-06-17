import type {PageResult, SysUser} from "../types";
import {ApiClient} from "./apiClient";

export class SysUserApi {
    static getSysUsers(pageIndex = 1, pageSize = 20) {
        return ApiClient.request<PageResult<SysUser>>("/api/sys-user/page", {
            method: "POST",
            body: JSON.stringify({pageIndex, pageSize, isDel: false}),
        });
    }

    static saveSysUser(user: SysUser) {
        const method = user.id ? "PUT" : "POST";
        return ApiClient.request<number>("/api/sys-user", {method, body: JSON.stringify(user)});
    }

    static deleteSysUser(id: number) {
        return ApiClient.request<number>(`/api/sys-user/${id}`, {method: "DELETE"});
    }
}
