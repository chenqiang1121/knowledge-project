package com.qiang.knowledge.managerapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qiang.knowledge.managerapi.dto.SysUserResponse;
import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysUser;
import com.qiang.knowledge.service.search.SysUserSearch;
import com.qiang.knowledge.service.service.SysUserService;
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
@RequestMapping("/api/sys-user")
public class SysUserController {

    private final SysUserService userService;

    /**
     * Builds the controller with the user business service.
     */
    public SysUserController(SysUserService userService) {
        this.userService = userService;
    }

    /**
     * Creates a user and returns the affected row count.
     */
    @PostMapping
    public ApiResult<Integer> create(@RequestBody SysUser user) {
        return userService.create(user);
    }

    /**
     * Updates a user by id and returns the affected row count.
     */
    @PutMapping
    public ApiResult<Integer> update(@RequestBody SysUser user) {
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
    public ApiResult<SysUserResponse> getById(@PathVariable Long id) {
        return ApiResult.success(SysUserResponse.from(userService.getById(id)));
    }

    /**
     * Returns users matched by SysUserSearch conditions.
     */
    @PostMapping("/list")
    public ApiResult<List<SysUserResponse>> queryList(@RequestBody(required = false) SysUserSearch search) {
        return ApiResult.success(userService.queryList(search).stream().map(SysUserResponse::from).toList());
    }

    /**
     * Returns a page of users matched by SysUserSearch conditions.
     */
    @PostMapping("/page")
    public ApiResult<Page<SysUserResponse>> queryPageList(@RequestBody(required = false) SysUserSearch search) {
        Page<SysUser> userPage = userService.queryPageList(search);
        Page<SysUserResponse> responsePage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        responsePage.setRecords(userPage.getRecords().stream().map(SysUserResponse::from).toList());
        responsePage.setPages(userPage.getPages());
        return ApiResult.success(responsePage);
    }
}
