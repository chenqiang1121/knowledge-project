package com.qiang.knowledge.managerapi.controller;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * TODO: 管理端 REST API 占位，后续拆到 Auth/User/Role/Document Controller。
 */
@RestController
@RequestMapping("/api")
public class ManagerController {

    /**
     * TODO: /api/auth/login 登录占位，后续接入账号密码校验和权限加载。
     */
    @PostMapping("/auth/login")
    public Map<String, Object> login() {
        long placeholderUserId = 1L;
        StpUtil.login(placeholderUserId);
        return Map.of(
                "message", "TODO: login placeholder",
                "token", StpUtil.getTokenValue()
        );
    }

    /**
     * TODO: /api/auth/logout 登出占位。
     */
    @PostMapping("/auth/logout")
    public Map<String, String> logout() {
        StpUtil.logout();
        return Map.of("message", "TODO: logout placeholder");
    }

    /**
     * TODO: /api/user/* 用户管理接口占位，后续补充分页、角色绑定、禁用启用。
     */
    @GetMapping("/user/placeholder")
    public Map<String, String> userPlaceholder() {
        return Map.of("message", "TODO: user management placeholder");
    }
}
