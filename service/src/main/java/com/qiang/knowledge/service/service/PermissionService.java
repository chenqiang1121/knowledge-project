package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.Permission;
import com.qiang.knowledge.service.mapper.PermissionMapper;
import com.qiang.knowledge.service.search.PermissionSearch;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * Builds the permission service with its required mapper dependency.
     */
    public PermissionService(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
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
}
