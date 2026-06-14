package com.qiang.knowledge.service.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.entity.SysMenu;

/**
 * Search POJO for building reusable MyBatis-Plus permission query conditions.
 */
public class SysMenuSearch extends PageSearch {

    /** Optional exact permission id filter. */
    private Long id;

    /** Optional permission name fuzzy-match filter. */
    private String name;

    /** Optional URL fuzzy-match filter. */
    private String url;

    /** Optional exact parent permission id filter. */
    private Long parentId;

    /** Optional exact menu display filter. */
    private Boolean isMenu;

    /** Optional route path fuzzy-match filter. */
    private String routePath;

    /** Optional component path fuzzy-match filter. */
    private String componentPath;

    /** Optional logical delete state filter. */
    private Boolean isDel;

    /** Builds the MyBatis-Plus lambda query wrapper for permission list queries. */
    public LambdaQueryWrapper<SysMenu> build() {
        LambdaQueryWrapper<SysMenu> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(id != null, SysMenu::getId, id)
                .like(hasText(name), SysMenu::getName, name)
                .like(hasText(url), SysMenu::getUrl, url)
                .eq(parentId != null, SysMenu::getParentId, parentId)
                .eq(isMenu != null, SysMenu::getIsMenu, isMenu)
                .like(hasText(routePath), SysMenu::getRoutePath, routePath)
                .like(hasText(componentPath), SysMenu::getComponentPath, componentPath)
                .eq(isDel != null, SysMenu::getIsDel, isDel)
                .orderByAsc(SysMenu::getSortOrder)
                .orderByAsc(SysMenu::getId);
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

    /** Returns the optional menu display filter. */
    public Boolean getIsMenu() {
        return isMenu;
    }

    /** Sets the optional menu display filter. */
    public void setIsMenu(Boolean isMenu) {
        this.isMenu = isMenu;
    }

    /** Returns the optional route path fuzzy-match filter. */
    public String getRoutePath() {
        return routePath;
    }

    /** Sets the optional route path fuzzy-match filter. */
    public void setRoutePath(String routePath) {
        this.routePath = routePath;
    }

    /** Returns the optional component path fuzzy-match filter. */
    public String getComponentPath() {
        return componentPath;
    }

    /** Sets the optional component path fuzzy-match filter. */
    public void setComponentPath(String componentPath) {
        this.componentPath = componentPath;
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
