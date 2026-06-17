package com.qiang.knowledge.service.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysMenu;
import com.qiang.knowledge.service.entity.SysRoleMenu;
import com.qiang.knowledge.service.entity.SysUser;
import com.qiang.knowledge.service.mapper.SysMenuMapper;
import com.qiang.knowledge.service.mapper.SysRoleMenuMapper;
import com.qiang.knowledge.service.mapper.SysUserMapper;
import com.qiang.knowledge.service.search.SysMenuSearch;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Custom menu service that coordinates menu persistence through
 * SysMenuMapper without extending the MyBatis-Plus default service implementation.
 */
@Service
public class SysMenuService {

    /**
     * Mapper used for menu table persistence operations.
     */
    private final SysMenuMapper menuMapper;

    /**
     * Mapper used for current-user role lookup.
     */
    private final SysUserMapper userMapper;

    /**
     * Mapper used for role-menu filtering.
     */
    private final SysRoleMenuMapper roleMenuMapper;

    /**
     * Builds the menu service with its required mapper dependency.
     */
    public SysMenuService(
            SysMenuMapper menuMapper,
            SysUserMapper userMapper,
            SysRoleMenuMapper roleMenuMapper
    ) {
        this.menuMapper = menuMapper;
        this.userMapper = userMapper;
        this.roleMenuMapper = roleMenuMapper;
    }

    /**
     * Inserts a new menu and returns the affected row count for business wrapping.
     */
    public ApiResult<Integer> create(SysMenu menu) {
        return ApiResult.success(menuMapper.insert(menu));
    }

    /**
     * Updates an existing menu by id and returns the affected row count.
     */
    public ApiResult<Integer> update(SysMenu menu) {
        return ApiResult.success(menuMapper.updateById(menu));
    }

    /**
     * Finds a single menu by primary key.
     */
    public SysMenu getById(Long id) {
        return menuMapper.selectById(id);
    }

    /**
     * Logically deletes a menu by id and returns the affected row count.
     */
    public ApiResult<Integer> deleteById(Long id) {
        return ApiResult.success(menuMapper.deleteById(id));
    }

    /**
     * Queries menus with conditions built by SysMenuSearch.
     */
    public List<SysMenu> queryList(SysMenuSearch search) {
        SysMenuSearch realSearch = search == null ? new SysMenuSearch() : search;
        return menuMapper.selectList(realSearch.build());
    }

    /**
     * Queries a page of menus with conditions built by SysMenuSearch.
     */
    public Page<SysMenu> queryPageList(SysMenuSearch search) {
        SysMenuSearch realSearch = search == null ? new SysMenuSearch() : search;
        Page<SysMenu> page = new Page<>(realSearch.getPageIndex(), realSearch.getPageSize());
        return menuMapper.selectPage(page, realSearch.build());
    }

    /**
     * Returns the current manager user's role-filtered menu tree.
     */
    public List<SysMenu> queryCurrentUserMenuTree() {
        Long userId = Long.valueOf(String.valueOf(StpUtil.getLoginId()));
        SysUser user = userMapper.selectById(userId);
        if (user == null || user.getSysRoleId() == null) {
            return List.of();
        }

        LambdaQueryWrapper<SysRoleMenu> relationWrapper = new LambdaQueryWrapper<>();
        relationWrapper.eq(SysRoleMenu::getSysRoleId, user.getSysRoleId());
        List<Long> sysMenuIds = roleMenuMapper.selectList(relationWrapper).stream()
                .map(SysRoleMenu::getSysMenuId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        if (sysMenuIds.isEmpty()) {
            return List.of();
        }

        LambdaQueryWrapper<SysMenu> menuWrapper = new LambdaQueryWrapper<>();
        menuWrapper.in(SysMenu::getId, sysMenuIds)
                .eq(SysMenu::getIsMenu, true)
                .and(wrapper -> wrapper.eq(SysMenu::getVisible, true).or().isNull(SysMenu::getVisible))
                .eq(SysMenu::getIsDel, false)
                .orderByAsc(SysMenu::getSortOrder)
                .orderByAsc(SysMenu::getId);
        return buildMenuTree(menuMapper.selectList(menuWrapper));
    }

    /**
     * Builds a stable parent-child menu tree from already sorted menu rows.
     */
    private List<SysMenu> buildMenuTree(List<SysMenu> menus) {
        Map<Long, SysMenu> menuById = new LinkedHashMap<>();
        for (SysMenu menu : menus) {
            menu.setChildren(new ArrayList<>());
            menuById.put(menu.getId(), menu);
        }

        List<SysMenu> roots = new ArrayList<>();
        for (SysMenu menu : menus) {
            SysMenu parent = menuById.get(menu.getParentId());
            if (parent == null) {
                roots.add(menu);
            } else {
                parent.getChildren().add(menu);
            }
        }
        return roots;
    }
}
