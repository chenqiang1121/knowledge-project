package com.qiang.knowledge.managerapi.controller;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Manager authentication controller for login and logout placeholder endpoints.
 */
@RestController
@RequestMapping("/api")
public class ManagerController {

    /**
     * Logs in a placeholder manager user and returns the current token value.
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
     * Logs out the current manager user session.
     */
    @PostMapping("/auth/logout")
    public Map<String, String> logout() {
        StpUtil.logout();
        return Map.of("message", "TODO: logout placeholder");
    }
}
