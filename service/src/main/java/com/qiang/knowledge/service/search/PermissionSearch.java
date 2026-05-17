package com.qiang.knowledge.service.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.entity.Permission;

/**
 * Search POJO for building reusable MyBatis-Plus permission query conditions.
 */
public class PermissionSearch extends PageSearch {

    /** Optional exact permission id filter. */
    private Long id;

    /** Optional permission name fuzzy-match filter. */
    private String name;

    /** Optional URL fuzzy-match filter. */
    private String url;

    /** Optional exact parent permission id filter. */
    private Long parentId;

    /** Optional logical delete state filter. */
    private Boolean isDel;

    /** Builds the MyBatis-Plus lambda query wrapper for permission list queries. */
    public LambdaQueryWrapper<Permission> build() {
        LambdaQueryWrapper<Permission> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(id != null, Permission::getId, id)
                .like(hasText(name), Permission::getName, name)
                .like(hasText(url), Permission::getUrl, url)
                .eq(parentId != null, Permission::getParentId, parentId)
                .eq(isDel != null, Permission::getIsDel, isDel)
                .orderByDesc(Permission::getId);
        return queryWrapper;
    }

    /** Returns true when a string filter has visible text. */
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /** Returns the optional exact permission id filter. */
    public Long getId() {
        return id;
    }

    /** Sets the optional exact permission id filter. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the optional permission name fuzzy-match filter. */
    public String getName() {
        return name;
    }

    /** Sets the optional permission name fuzzy-match filter. */
    public void setName(String name) {
        this.name = name;
    }

    /** Returns the optional URL fuzzy-match filter. */
    public String getUrl() {
        return url;
    }

    /** Sets the optional URL fuzzy-match filter. */
    public void setUrl(String url) {
        this.url = url;
    }

    /** Returns the optional exact parent permission id filter. */
    public Long getParentId() {
        return parentId;
    }

    /** Sets the optional exact parent permission id filter. */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /** Returns the optional logical delete state filter. */
    public Boolean getIsDel() {
        return isDel;
    }

    /** Sets the optional logical delete state filter. */
    public void setIsDel(Boolean isDel) {
        this.isDel = isDel;
    }

}
