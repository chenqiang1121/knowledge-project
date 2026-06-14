package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysRole;
import com.qiang.knowledge.service.entity.SysRoleMenu;
import com.qiang.knowledge.service.mapper.SysRoleMapper;
import com.qiang.knowledge.service.mapper.SysRoleMenuMapper;
import com.qiang.knowledge.service.search.SysRoleSearch;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * Custom role service that coordinates role persistence through SysRoleMapper
 * without extending the MyBatis-Plus default service implementation.
 */
@Service
public class SysRoleService {

    /**
     * Mapper used for roles table persistence operations.
     */
    private final SysRoleMapper roleMapper;

    /**
     * Mapper used for role-permission relation persistence operations.
     */
    private final SysRoleMenuMapper rolePermissionMapper;

    /**
     * Builds the role service with its required mapper dependency.
     */
    public SysRoleService(SysRoleMapper roleMapper, SysRoleMenuMapper rolePermissionMapper) {
        this.roleMapper = roleMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    /**
     * Inserts a new role and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(SysRole role) {
        return ApiResult.success(roleMapper.insert(role));
    }

    /**
     * Updates an existing role by id and returns the affected row count.
     */
    public ApiResult<Integer> update(SysRole role) {
        return ApiResult.success(roleMapper.updateById(role));
    }

    /**
     * Finds a single role by primary key.
     */
    public SysRole getById(Long id) {
        return roleMapper.selectById(id);
    }

    /**
     * Logically deletes a role by id and returns the affected row count.
     */
    public ApiResult<Integer> deleteById(Long id) {
        return ApiResult.success(roleMapper.deleteById(id));
    }

    /**
     * Queries roles with conditions built by SysRoleSearch.
     */
    public List<SysRole> queryList(SysRoleSearch search) {
        SysRoleSearch realSearch = search == null ? new SysRoleSearch() : search;
        return roleMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of roles with conditions built by SysRoleSearch.
     */
    public Page<SysRole> queryPageList(SysRoleSearch search) {
        SysRoleSearch realSearch = search == null ? new SysRoleSearch() : search;
        Page<SysRole> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return roleMapper.selectPage(page, realSearch.build());
    }

    /**
     * Returns permission ids currently assigned to a role.
     */
    public List<Long> querySysMenuIds(Long sysRoleId) {
        LambdaQueryWrapper<SysRoleMenu> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysRoleMenu::getSysRoleId, sysRoleId);
        return rolePermissionMapper.selectList(queryWrapper).stream()
                .map(SysRoleMenu::getSysMenuId)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * Replaces all permission assignments for a role and returns affected rows.
     */
    @Transactional
    public ApiResult<Integer> replaceSysMenuIds(Long sysRoleId, List<Long> sysMenuIds) {
        QueryWrapper<SysRoleMenu> deleteWrapper = new QueryWrapper<>();
        deleteWrapper.eq("sys_role_id", sysRoleId);
        int affectedRows = rolePermissionMapper.delete(deleteWrapper);
        if (sysMenuIds != null) {
            for (Long sysMenuId : sysMenuIds.stream().filter(Objects::nonNull).distinct().toList()) {
                SysRoleMenu relation = new SysRoleMenu();
                relation.setSysRoleId(sysRoleId);
                relation.setSysMenuId(sysMenuId);
                affectedRows += rolePermissionMapper.insert(relation);
            }
        }
        return ApiResult.success(affectedRows);
    }
}
