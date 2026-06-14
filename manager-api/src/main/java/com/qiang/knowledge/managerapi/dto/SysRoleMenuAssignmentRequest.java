package com.qiang.knowledge.managerapi.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload used to replace a role's assigned permission ids.
 */
public class SysRoleMenuAssignmentRequest {

    /** SysMenu ids that should belong to the role after saving. */
    private List<Long> sysMenuIds = new ArrayList<>();

    /** Returns the submitted menu ids. */
    public List<Long> getSysMenuIds() {
        return sysMenuIds;
    }

    /** Sets the submitted menu ids. */
    public void setSysMenuIds(List<Long> sysMenuIds) {
        this.sysMenuIds = sysMenuIds;
    }
}
