package com.qiang.knowledge.managerapi.controller;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysRole;
import com.qiang.knowledge.service.search.SysRoleSearch;
import com.qiang.knowledge.service.service.SysRoleService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qiang.knowledge.managerapi.dto.SysRoleMenuAssignmentRequest;
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
 * Manager API controller for role create, update, delete, detail, and list operations.
 */
@RestController
@RequestMapping("/api/sys-role")
public class SysRoleController {

    private final SysRoleService roleService;

    /**
     * Builds the controller with the role business service.
     */
    public SysRoleController(SysRoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * Creates a role and returns the affected row count.
     */
    @PostMapping
    public ApiResult<Integer> create(@RequestBody SysRole role) {
        return roleService.create(role);
    }

    /**
     * Updates a role by id and returns the affected row count.
     */
    @PutMapping
    public ApiResult<Integer> update(@RequestBody SysRole role) {
        return roleService.update(role);
    }

    /**
     * Deletes a role logically by id and returns the affected row count.
     */
    @DeleteMapping("/{id}")
    public ApiResult<Integer> deleteById(@PathVariable Long id) {
        return roleService.deleteById(id);
    }

    /**
     * Returns a role detail by id.
     */
    @GetMapping("/{id}")
    public ApiResult<SysRole> getById(@PathVariable Long id) {
        return ApiResult.success(roleService.getById(id));
    }

    /**
     * Returns roles matched by SysRoleSearch conditions.
     */
    @PostMapping("/list")
    public ApiResult<List<SysRole>> queryList(@RequestBody(required = false) SysRoleSearch search) {
        return ApiResult.success(roleService.queryList(search));
    }

    /**
     * Returns a page of roles matched by SysRoleSearch conditions.
     */
    @PostMapping("/page")
    public ApiResult<Page<SysRole>> queryPageList(@RequestBody(required = false) SysRoleSearch search) {
        return ApiResult.success(roleService.queryPageList(search));
    }

    /**
     * Returns permission ids assigned to a role.
     */
    @GetMapping("/{id}/menus")
    public ApiResult<List<Long>> querySysMenuIds(@PathVariable Long id) {
        return ApiResult.success(roleService.querySysMenuIds(id));
    }

    /**
     * Replaces all permission ids assigned to a role.
     */
    @PutMapping("/{id}/menus")
    public ApiResult<Integer> replaceSysMenuIds(
            @PathVariable Long id,
            @RequestBody(required = false) SysRoleMenuAssignmentRequest request
    ) {
        List<Long> sysMenuIds = request == null ? List.of() : request.getSysMenuIds();
        return roleService.replaceSysMenuIds(id, sysMenuIds);
    }
}
