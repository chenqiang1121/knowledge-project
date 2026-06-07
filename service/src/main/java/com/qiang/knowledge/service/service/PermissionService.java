package com.qiang.knowledge.service.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.Permission;
import com.qiang.knowledge.service.entity.RolePermission;
import com.qiang.knowledge.service.entity.User;
import com.qiang.knowledge.service.mapper.PermissionMapper;
import com.qiang.knowledge.service.mapper.RolePermissionMapper;
import com.qiang.knowledge.service.mapper.UserMapper;
import com.qiang.knowledge.service.search.PermissionSearch;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Custom permission service that coordinates permission persistence through
 * PermissionMapper without extending the MyBatis-Plus default service implementation.
 */
@Service
public class PermissionService {

    /**
     * Mapper used for permissions table persistence operations.
     */
    private final PermissionMapper permissionMapper;

    /**
     * Mapper used for current-user role lookup.
     */
    private final UserMapper userMapper;

    /**
     * Mapper used for role-permission menu filtering.
     */
    private final RolePermissionMapper rolePermissionMapper;

    /**
     * Builds the permission service with its required mapper dependency.
     */
    public PermissionService(
            PermissionMapper permissionMapper,
            UserMapper userMapper,
            RolePermissionMapper rolePermissionMapper
    ) {
        this.permissionMapper = permissionMapper;
        this.userMapper = userMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    /**
     * Inserts a new permission and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(Permission permission) {
        return ApiResult.success(permissionMapper.insert(permission));
    }

    /**
     * Updates an existing permission by id and returns the affected row count.
     */
    public ApiResult<Integer> update(Permission permission) {
        return ApiResult.success(permissionMapper.updateById(permission));
    }

    /**
     * Finds a single permission by primary key.
     */
    public Permission getById(Long id) {
        return permissionMapper.selectById(id);
    }

    /**
     * Logically deletes a permission by id and returns the affected row count.
     */
    public ApiResult<Integer> deleteById(Long id) {
        return ApiResult.success(permissionMapper.deleteById(id));
    }

    /**
     * Queries permissions with conditions built by PermissionSearch.
     */
    public List<Permission> queryList(PermissionSearch search) {
        PermissionSearch realSearch = search == null ? new PermissionSearch() : search;
        return permissionMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of permissions with conditions built by PermissionSearch.
     */
    public Page<Permission> queryPageList(PermissionSearch search) {
        PermissionSearch realSearch = search == null ? new PermissionSearch() : search;
        Page<Permission> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return permissionMapper.selectPage(page, realSearch.build());
    }

    /**
     * Returns the current manager user's role-filtered menu tree.
     */
    public List<Permission> queryCurrentUserMenuTree() {
        Long userId = Long.valueOf(String.valueOf(StpUtil.getLoginId()));
        User user = userMapper.selectById(userId);
        if (user == null || user.getRoleId() == null) {
            return List.of();
        }

        LambdaQueryWrapper<RolePermission> relationWrapper = new LambdaQueryWrapper<>();
        relationWrapper.eq(RolePermission::getRoleId, user.getRoleId());
        List<Long> permissionIds = rolePermissionMapper.selectList(relationWrapper).stream()
                .map(RolePermission::getPermissionId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (permissionIds.isEmpty()) {
            return List.of();
        }

        LambdaQueryWrapper<Permission> menuWrapper = new LambdaQueryWrapper<>();
        menuWrapper.in(Permission::getId, permissionIds)
                .eq(Permission::getIsMenu, true)
                .eq(Permission::getIsDel, false)
                .orderByAsc(Permission::getSortOrder)
                .orderByAsc(Permission::getId);
        return buildMenuTree(permissionMapper.selectList(menuWrapper));
    }

    /**
     * Builds a stable parent-child menu tree from already sorted menu rows.
     */
    private List<Permission> buildMenuTree(List<Permission> permissions) {
        Map<Long, Permission> permissionById = new LinkedHashMap<>();
        for (Permission permission : permissions) {
            permission.setChildren(new ArrayList<>());
            permissionById.put(permission.getId(), permission);
        }

        List<Permission> roots = new ArrayList<>();
        for (Permission permission : permissions) {
            Permission parent = permissionById.get(permission.getParentId());
            if (parent == null) {
                roots.add(permission);
            } else {
                parent.getChildren().add(permission);
            }
        }
        return roots;
    }
}
