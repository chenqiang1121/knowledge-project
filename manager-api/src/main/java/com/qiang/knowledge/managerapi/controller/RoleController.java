package com.qiang.knowledge.managerapi.controller;

import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.Role;
import com.qiang.knowledge.service.search.RoleSearch;
import com.qiang.knowledge.service.service.RoleService;
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
 * Manager API controller for role create, update, delete, detail, and list operations.
 */
@RestController
@RequestMapping("/api/role")
public class RoleController {

    private final RoleService roleService;

    /**
     * Builds the controller with the role business service.
     */
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * Creates a role and returns the affected row count.
     */
    @PostMapping
    public ApiResult<Integer> create(@RequestBody Role role) {
        return roleService.create(role);
    }

    /**
     * Updates a role by id and returns the affected row count.
     */
    @PutMapping
    public ApiResult<Integer> update(@RequestBody Role role) {
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
    public ApiResult<Role> getById(@PathVariable Long id) {
        return ApiResult.success(roleService.getById(id));
    }

    /**
     * Returns roles matched by RoleSearch conditions.
     */
    @PostMapping("/list")
    public ApiResult<List<Role>> queryList(@RequestBody(required = false) RoleSearch search) {
        return ApiResult.success(roleService.queryList(search));
    }

    /**
     * Returns a page of roles matched by RoleSearch conditions.
     */
    @PostMapping("/page")
    public ApiResult<Page<Role>> queryPageList(@RequestBody(required = false) RoleSearch search) {
        return ApiResult.success(roleService.queryPageList(search));
    }
}
