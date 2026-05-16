package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.Role;
import com.qiang.knowledge.service.mapper.RoleMapper;
import com.qiang.knowledge.service.search.RoleSearch;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * Builds the role service with its required mapper dependency.
     */
    public RoleService(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
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
}
