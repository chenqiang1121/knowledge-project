package com.qiang.knowledge.service.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.entity.SysRole;

/**
 * Search POJO for building reusable MyBatis-Plus role query conditions.
 */
public class SysRoleSearch extends PageSearch {

    /** Optional exact role id filter. */
    private Long id;

    /** Optional role name fuzzy-match filter. */
    private String roleName;

    /** Optional logical delete state filter. */
    private Boolean isDel;

    /** Builds the MyBatis-Plus lambda query wrapper for role list queries. */
    public LambdaQueryWrapper<SysRole> build() {
        LambdaQueryWrapper<SysRole> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(id != null, SysRole::getId, id)
                .like(hasText(roleName), SysRole::getRoleName, roleName)
                .eq(isDel != null, SysRole::getIsDel, isDel)
                .orderByDesc(SysRole::getId);
        return queryWrapper;
    }

    /** Returns true when a string filter has visible text. */
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /** Returns the optional exact role id filter. */
    public Long getId() {
        return id;
    }

    /** Sets the optional exact role id filter. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the optional role name fuzzy-match filter. */
    public String getRoleName() {
        return roleName;
    }

    /** Sets the optional role name fuzzy-match filter. */
    public void setRoleName(String roleName) {
        this.roleName = roleName;
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
