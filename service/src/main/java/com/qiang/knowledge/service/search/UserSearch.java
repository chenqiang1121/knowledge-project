package com.qiang.knowledge.service.search;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.entity.User;

/**
 * Search POJO for building reusable MyBatis-Plus user query conditions.
 */
public class UserSearch {

    /** Optional exact user id filter. */
    private Long id;

    /** Optional username fuzzy-match filter. */
    private String username;

    /** Optional exact role id filter. */
    private Long roleId;

    /** Optional logical delete state filter. */
    private Boolean isDel;

    /** Builds the MyBatis-Plus lambda query wrapper for user list queries. */
    public LambdaQueryWrapper<User> build() {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(id != null, User::getId, id)
                .like(hasText(username), User::getUsername, username)
                .eq(roleId != null, User::getRoleId, roleId)
                .eq(isDel != null, User::getIsDel, isDel)
                .orderByDesc(User::getId);
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
    public Long getRoleId() {
        return roleId;
    }

    /** Sets the optional exact role id filter. */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
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
