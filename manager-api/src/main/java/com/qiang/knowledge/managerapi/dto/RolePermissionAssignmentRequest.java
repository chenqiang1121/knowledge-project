package com.qiang.knowledge.managerapi.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload used to replace a role's assigned permission ids.
 */
public class RolePermissionAssignmentRequest {

    /** Permission ids that should belong to the role after saving. */
    private List<Long> permissionIds = new ArrayList<>();

    /** Returns the submitted permission ids. */
    public List<Long> getPermissionIds() {
        return permissionIds;
    }

    /** Sets the submitted permission ids. */
    public void setPermissionIds(List<Long> permissionIds) {
        this.permissionIds = permissionIds;
    }
}
