package com.qiang.knowledge.service.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * User table entity for account credentials, role ownership, audit timestamps,
 * and logical deletion state.
 */
@TableName("users")
public class User {

    /** User primary key. */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** Login and display username. */
    private String username;

    /** Stored user password value. */
    private String password;

    /** Role id assigned to the user. */
    private Long roleId;

    /** Time when the user row was created. */
    private LocalDateTime createTime;

    /** Time when the user row was last updated. */
    private LocalDateTime updateTime;

    /** Logical delete marker managed by MyBatis-Plus. */
    @TableLogic
    private Boolean isDel;

    /** Returns the user primary key. */
    public Long getId() {
        return id;
    }

    /** Sets the user primary key. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the login and display username. */
    public String getUsername() {
        return username;
    }

    /** Sets the login and display username. */
    public void setUsername(String username) {
        this.username = username;
    }

    /** Returns the stored user password value. */
    public String getPassword() {
        return password;
    }

    /** Sets the stored user password value. */
    public void setPassword(String password) {
        this.password = password;
    }

    /** Returns the role id assigned to the user. */
    public Long getRoleId() {
        return roleId;
    }

    /** Sets the role id assigned to the user. */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    /** Returns the time when the user row was created. */
    public LocalDateTime getCreateTime() {
        return createTime;
    }

    /** Sets the time when the user row was created. */
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    /** Returns the time when the user row was last updated. */
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    /** Sets the time when the user row was last updated. */
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
