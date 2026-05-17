package com.qiang.knowledge.service.service;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.User;
import com.qiang.knowledge.service.mapper.UserMapper;
import com.qiang.knowledge.service.search.UserSearch;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Custom user service that coordinates user persistence through UserMapper
 * without extending the MyBatis-Plus default service implementation.
 */
@Service
public class UserService {

    /**
     * Mapper used for users table persistence operations.
     */
    private final UserMapper userMapper;

    /**
     * Builds the user service with its required mapper dependency.
     */
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * Inserts a new user and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(User user) {
        return ApiResult.success(userMapper.insert(user));
    }

    /**
     * Updates an existing user by id and returns the affected row count.
     */
    public ApiResult<Integer> update(User user) {
        return ApiResult.success(userMapper.updateById(user));
    }

    /**
     * Finds a single user by primary key.
     */
    public User getById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * Finds a single active user by username for login validation.
     */
    public User getByUsername(String username) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username)
                .eq(User::getIsDel, false)
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
     * Queries users with conditions built by UserSearch.
     */
    public List<User> queryList(UserSearch search) {
        UserSearch realSearch = search == null ? new UserSearch() : search;
        return userMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of users with conditions built by UserSearch.
     */
    public Page<User> queryPageList(UserSearch search) {
        UserSearch realSearch = search == null ? new UserSearch() : search;
        Page<User> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return userMapper.selectPage(page, realSearch.build());
    }
}
