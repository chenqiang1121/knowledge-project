package com.qiang.knowledge.managerapi.controller;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.User;
import com.qiang.knowledge.service.search.UserSearch;
import com.qiang.knowledge.service.service.UserService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Manager API controller for user create, update, delete, detail, and list operations.
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    /**
     * Builds the controller with the user business service.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Creates a user and returns the affected row count.
     */
    @PostMapping
    public ApiResult<Integer> create(@RequestBody User user) {
        return userService.create(user);
    }

    /**
     * Updates a user by id and returns the affected row count.
     */
    @PutMapping
    public ApiResult<Integer> update(@RequestBody User user) {
        return userService.update(user);
    }

    /**
     * Deletes a user logically by id and returns the affected row count.
     */
    @DeleteMapping("/{id}")
    public ApiResult<Integer> deleteById(@PathVariable Long id) {
        return userService.deleteById(id);
    }

    /**
     * Returns a user detail by id.
     */
    @GetMapping("/{id}")
    public ApiResult<User> getById(@PathVariable Long id) {
        return ApiResult.success(userService.getById(id));
    }

    /**
     * Returns users matched by UserSearch conditions.
     */
    @PostMapping("/list")
    public ApiResult<List<User>> queryList(@RequestBody(required = false) UserSearch search) {
        return ApiResult.success(userService.queryList(search));
    }

    /**
     * Returns a page of users matched by UserSearch conditions.
     */
    @PostMapping("/page")
    public ApiResult<Page<User>> queryPageList(@RequestBody(required = false) UserSearch search) {
        return ApiResult.success(userService.queryPageList(search));
    }
}
