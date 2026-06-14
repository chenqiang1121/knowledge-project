package com.qiang.knowledge.service.entity;

import com.baomidou.mybatisplus.annotation.TableName;

/**
 * SysRole-permission relation entity that stores which permissions belong to each role.
 */
@TableName("sys_role_menu")
public class SysRoleMenu {

    /** SysRole id in the relation. */
    private Long sysRoleId;

    /** SysMenu id in the relation. */
    private Long sysMenuId;

    /** Returns the relation role id. */
    public Long getSysRoleId() {
        return sysRoleId;
    }

    /** Sets the relation role id. */
    public void setSysRoleId(Long sysRoleId) {
        this.sysRoleId = sysRoleId;
    }

    /** Returns the relation permission id. */
    public Long getSysMenuId() {
        return sysMenuId;
    }

    /** Sets the relation permission id. */
    public void setSysMenuId(Long sysMenuId) {
        this.sysMenuId = sysMenuId;
    }
}
