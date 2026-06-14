package com.qiang.knowledge.managerapi.dto;

import com.qiang.knowledge.service.entity.SysUser;

import java.time.LocalDateTime;

/**
 * Safe user payload for manager API responses that intentionally omits passwords.
 */
public class SysUserResponse {

    /** SysUser primary key. */
    private Long id;

    /** Login and display username. */
    private String username;

    /** Assigned role id. */
    private Long sysRoleId;

    /** Time when the user row was created. */
    private LocalDateTime createTime;

    /** Time when the user row was last updated. */
    private LocalDateTime updateTime;

    /** Logical delete marker. */
    private Boolean isDel;

    /** Builds a safe response object from a user entity. */
    public static SysUserResponse from(SysUser user) {
        if (user == null) {
            return null;
        }
        SysUserResponse response = new SysUserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setSysRoleId(user.getSysRoleId());
        response.setCreateTime(user.getCreateTime());
        response.setUpdateTime(user.getUpdateTime());
        response.setIsDel(user.getIsDel());
        return response;
    }

    /** Returns the user primary key. */
    public Long getId() {
        return id;
    }

    /** Sets the user primary key. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the username. */
    public String getUsername() {
        return username;
    }

    /** Sets the username. */
    public void setUsername(String username) {
        this.username = username;
    }

    /** Returns the assigned role id. */
    public Long getSysRoleId() {
        return sysRoleId;
    }

    /** Sets the assigned role id. */
    public void setSysRoleId(Long sysRoleId) {
        this.sysRoleId = sysRoleId;
    }

    /** Returns the create time. */
    public LocalDateTime getCreateTime() {
        return createTime;
    }

    /** Sets the create time. */
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    /** Returns the update time. */
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    /** Sets the update time. */
    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    /** Returns the logical delete marker. */
    public Boolean getIsDel() {
        return isDel;
    }

    /** Sets the logical delete marker. */
    public void setIsDel(Boolean isDel) {
        this.isDel = isDel;
    }
}
