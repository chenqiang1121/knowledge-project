package com.qiang.knowledge.service.entity;

import com.baomidou.mybatisplus.annotation.TableName;

/**
 * Role-permission relation entity that stores which permissions belong to each role.
 */
@TableName("role_permission")
public class RolePermission {

    /** Role id in the relation. */
    private Long roleId;

    /** Permission id in the relation. */
    private Long permissionId;

    /** Returns the relation role id. */
    public Long getRoleId() {
        return roleId;
    }

    /** Sets the relation role id. */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    /** Returns the relation permission id. */
    public Long getPermissionId() {
        return permissionId;
    }

    /** Sets the relation permission id. */
    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }
}
