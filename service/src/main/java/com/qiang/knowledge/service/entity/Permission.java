package com.qiang.knowledge.service.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * Permission table entity used to describe menu nodes or protected resources.
 */
@TableName("permissions")
public class Permission {

    /** Permission primary key. */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** Permission or menu display name. */
    private String name;

    /** Frontend URL or protected resource path. */
    private String url;

    /** Parent permission id for menu hierarchies. */
    private Long parentId;

    /** Time when the permission row was created. */
    private LocalDateTime createTime;

    /** Time when the permission row was last updated. */
    private LocalDateTime updateTime;

    /** Logical delete marker managed by MyBatis-Plus. */
    @TableLogic
    private Boolean isDel;

    /** Returns the permission primary key. */
    public Long getId() {
        return id;
    }

    /** Sets the permission primary key. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the permission or menu display name. */
    public String getName() {
        return name;
    }

    /** Sets the permission or menu display name. */
    public void setName(String name) {
        this.name = name;
    }

    /** Returns the frontend URL or protected resource path. */
    public String getUrl() {
        return url;
    }

    /** Sets the frontend URL or protected resource path. */
    public void setUrl(String url) {
        this.url = url;
    }

    /** Returns the parent permission id. */
    public Long getParentId() {
        return parentId;
    }

    /** Sets the parent permission id. */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /** Returns the time when the permission row was created. */
    public LocalDateTime getCreateTime() {
        return createTime;
    }

    /** Sets the time when the permission row was created. */
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    /** Returns the time when the permission row was last updated. */
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    /** Sets the time when the permission row was last updated. */
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
