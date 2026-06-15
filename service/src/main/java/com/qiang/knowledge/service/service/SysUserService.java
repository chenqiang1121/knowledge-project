package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysUser;
import com.qiang.knowledge.service.mapper.SysUserMapper;
import com.qiang.knowledge.service.search.SysUserSearch;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Custom user service that coordinates user persistence through SysUserMapper
 * without extending the MyBatis-Plus default service implementation.
 */
@Service
public class SysUserService {

    /**
     * Mapper used for users table persistence operations.
     */
    private final SysUserMapper userMapper;
    private final PasswordService passwordService;

    /**
     * Builds the user service with its required mapper dependency.
     */
    public SysUserService(SysUserMapper userMapper, PasswordService passwordService) {
        this.userMapper = userMapper;
        this.passwordService = passwordService;
    }

    /**
     * Inserts a new user and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(SysUser user) {
        user.setPassword(passwordService.encode(user.getPassword()));
        return ApiResult.success(userMapper.insert(user));
    }

    /**
     * Updates an existing user by id and returns the affected row count.
     */
    public ApiResult<Integer> update(SysUser user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword(null);
        } else {
            user.setPassword(passwordService.encode(user.getPassword()));
        }
        return ApiResult.success(userMapper.updateById(user));
    }

    /**
     * Returns whether a submitted password matches the stored password hash.
     */
    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordService.matches(rawPassword, encodedPassword);
    }

    /**
     * Finds a single user by primary key.
     */
    public SysUser getById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * Finds a single active user by username for login validation.
     */
    public SysUser getByUsername(String username) {
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysUser::getUsername, username)
                .eq(SysUser::getIsDel, false)
                .last("limit 1");
        return userMapper.selectOne(queryWrapper);
    }

    /**
     * Logically deletes a user by id and returns the affected row count.
     */
    public ApiResult<Integer> deleteById(Long id) {
        return ApiResult.success(userMapper.deleteById(id));
    }

    /**
     * Queries users with conditions built by SysUserSearch.
     */
    public List<SysUser> queryList(SysUserSearch search) {
        SysUserSearch realSearch = search == null ? new SysUserSearch() : search;
        return userMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of users with conditions built by SysUserSearch.
     */
    public Page<SysUser> queryPageList(SysUserSearch search) {
        SysUserSearch realSearch = search == null ? new SysUserSearch() : search;
        Page<SysUser> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return userMapper.selectPage(page, realSearch.build());
    }
}
