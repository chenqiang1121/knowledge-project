package com.qiang.knowledge.service.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.entity.SysUser;

/**
 * Search POJO for building reusable MyBatis-Plus user query conditions.
 */
public class SysUserSearch extends PageSearch {

    /** Optional exact user id filter. */
    private Long id;

    /** Optional username fuzzy-match filter. */
    private String username;

    /** Optional exact role id filter. */
    private Long sysRoleId;

    /** Optional logical delete state filter. */
    private Boolean isDel;

    /** Builds the MyBatis-Plus lambda query wrapper for user list queries. */
    public LambdaQueryWrapper<SysUser> build() {
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(id != null, SysUser::getId, id)
                .like(hasText(username), SysUser::getUsername, username)
                .eq(sysRoleId != null, SysUser::getSysRoleId, sysRoleId)
                .eq(isDel != null, SysUser::getIsDel, isDel)
                .orderByDesc(SysUser::getId);
        return queryWrapper;
    }

    /** Returns true when a string filter has visible text. */
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /** Returns the optional exact user id filter. */
    public Long getId() {
        return id;
    }

    /** Sets the optional exact user id filter. */
    public void setId(Long id) {
        this.id = id;
    }

    /** Returns the optional username fuzzy-match filter. */
    public String getUsername() {
        return username;
    }

    /** Sets the optional username fuzzy-match filter. */
    public void setUsername(String username) {
        this.username = username;
    }

    /** Returns the optional exact role id filter. */
    public Long getSysRoleId() {
        return sysRoleId;
    }

    /** Sets the optional exact role id filter. */
    public void setSysRoleId(Long sysRoleId) {
        this.sysRoleId = sysRoleId;
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
