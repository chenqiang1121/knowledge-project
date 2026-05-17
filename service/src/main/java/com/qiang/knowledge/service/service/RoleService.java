package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.Role;
import com.qiang.knowledge.service.entity.RolePermission;
import com.qiang.knowledge.service.mapper.RoleMapper;
import com.qiang.knowledge.service.mapper.RolePermissionMapper;
import com.qiang.knowledge.service.search.RoleSearch;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * Custom role service that coordinates role persistence through RoleMapper
 * without extending the MyBatis-Plus default service implementation.
 */
@Service
public class RoleService {

    /**
     * Mapper used for roles table persistence operations.
     */
    private final RoleMapper roleMapper;

    /**
     * Mapper used for role-permission relation persistence operations.
     */
    private final RolePermissionMapper rolePermissionMapper;

    /**
     * Builds the role service with its required mapper dependency.
     */
    public RoleService(RoleMapper roleMapper, RolePermissionMapper rolePermissionMapper) {
        this.roleMapper = roleMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    /**
     * Inserts a new role and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(Role role) {
        return ApiResult.success(roleMapper.insert(role));
    }

    /**
     * Updates an existing role by id and returns the affected row count.
     */
    public ApiResult<Integer> update(Role role) {
        return ApiResult.success(roleMapper.updateById(role));
    }

    /**
     * Finds a single role by primary key.
     */
    public Role getById(Long id) {
        return roleMapper.selectById(id);
    }

    /**
     * Logically deletes a role by id and returns the affected row count.
     */
    public ApiResult<Integer> deleteById(Long id) {
        return ApiResult.success(roleMapper.deleteById(id));
    }

    /**
     * Queries roles with conditions built by RoleSearch.
     */
    public List<Role> queryList(RoleSearch search) {
        RoleSearch realSearch = search == null ? new RoleSearch() : search;
        return roleMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of roles with conditions built by RoleSearch.
     */
    public Page<Role> queryPageList(RoleSearch search) {
        RoleSearch realSearch = search == null ? new RoleSearch() : search;
        Page<Role> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return roleMapper.selectPage(page, realSearch.build());
    }

    /**
     * Returns permission ids currently assigned to a role.
     */
    public List<Long> queryPermissionIds(Long roleId) {
        LambdaQueryWrapper<RolePermission> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(RolePermission::getRoleId, roleId);
        return rolePermissionMapper.selectList(queryWrapper).stream()
                .map(RolePermission::getPermissionId)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * Replaces all permission assignments for a role and returns affected rows.
     */
    @Transactional
    public ApiResult<Integer> replacePermissionIds(Long roleId, List<Long> permissionIds) {
        QueryWrapper<RolePermission> deleteWrapper = new QueryWrapper<>();
        deleteWrapper.eq("role_id", roleId);
        int affectedRows = rolePermissionMapper.delete(deleteWrapper);
        if (permissionIds != null) {
            for (Long permissionId : permissionIds.stream().filter(Objects::nonNull).distinct().toList()) {
                RolePermission relation = new RolePermission();
                relation.setRoleId(roleId);
                relation.setPermissionId(permissionId);
                affectedRows += rolePermissionMapper.insert(relation);
            }
        }
        return ApiResult.success(affectedRows);
    }
}
