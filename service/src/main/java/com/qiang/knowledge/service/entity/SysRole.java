package com.qiang.knowledge.service.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * SysRole table entity used to group users and describe their authorization scope.
 */
@TableName("sys_role")
public class SysRole {

    /** SysRole primary key. */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** Unique or display role name. */
    private String roleName;

    /** Optional role description for administrators. */
    private String description;

    /** Time when the role row was created. */
    private LocalDateTime createTime;

    /** Time when the role row was last updated. */
    private LocalDateTime updateTime;

    /** Logical delete marker managed by MyBatis-Plus. */
    @TableLogic
    private Boolean isDel;

    /** Returns the role primary key. */
    public Long getId() {
        return id;
    }

    /** Sets the role primary key. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the role name. */
    public String getRoleName() {
        return roleName;
    }

    /** Sets the role name. */
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    /** Returns the role description. */
    public String getDescription() {
        return description;
    }

    /** Sets the role description. */
    public void setDescription(String description) {
        this.description = description;
    }

    /** Returns the time when the role row was created. */
    public LocalDateTime getCreateTime() {
        return createTime;
    }

    /** Sets the time when the role row was created. */
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    /** Returns the time when the role row was last updated. */
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    /** Sets the time when the role row was last updated. */
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
