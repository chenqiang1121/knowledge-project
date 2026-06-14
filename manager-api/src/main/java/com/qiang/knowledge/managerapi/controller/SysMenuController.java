package com.qiang.knowledge.managerapi.controller;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysMenu;
import com.qiang.knowledge.service.search.SysMenuSearch;
import com.qiang.knowledge.service.service.SysMenuService;
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
 * Manager API controller for permission create, update, delete, detail, and list operations.
 */
@RestController
@RequestMapping("/api/sys-menu")
public class SysMenuController {

    private final SysMenuService permissionService;

    /**
     * Builds the controller with the permission business service.
     */
    public SysMenuController(SysMenuService permissionService) {
        this.permissionService = permissionService;
    }

    /**
     * Creates a permission and returns the affected row count.
     */
    @PostMapping
    public ApiResult<Integer> create(@RequestBody SysMenu permission) {
        return permissionService.create(permission);
    }

    /**
     * Updates a permission by id and returns the affected row count.
     */
    @PutMapping
    public ApiResult<Integer> update(@RequestBody SysMenu permission) {
        return permissionService.update(permission);
    }

    /**
     * Deletes a permission logically by id and returns the affected row count.
     */
    @DeleteMapping("/{id}")
    public ApiResult<Integer> deleteById(@PathVariable Long id) {
        return permissionService.deleteById(id);
    }

    /**
     * Returns a permission detail by id.
     */
    @GetMapping("/{id}")
    public ApiResult<SysMenu> getById(@PathVariable Long id) {
        return ApiResult.success(permissionService.getById(id));
    }

    /**
     * Returns the current manager user's role-filtered menu tree.
     */
    @GetMapping("/menu")
    public ApiResult<List<SysMenu>> queryCurrentUserMenuTree() {
        return ApiResult.success(permissionService.queryCurrentUserMenuTree());
    }

    /**
     * Returns permissions matched by SysMenuSearch conditions.
     */
    @PostMapping("/list")
    public ApiResult<List<SysMenu>> queryList(@RequestBody(required = false) SysMenuSearch search) {
        return ApiResult.success(permissionService.queryList(search));
    }

    /**
     * Returns a page of permissions matched by SysMenuSearch conditions.
     */
    @PostMapping("/page")
    public ApiResult<Page<SysMenu>> queryPageList(@RequestBody(required = false) SysMenuSearch search) {
        return ApiResult.success(permissionService.queryPageList(search));
    }
}
