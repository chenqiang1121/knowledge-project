package com.qiang.knowledge.managerapi.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.qiang.knowledge.managerapi.dto.LoginRequest;
import com.qiang.knowledge.managerapi.dto.LoginResponse;
import com.qiang.knowledge.managerapi.dto.SysUserResponse;
import com.qiang.knowledge.service.common.ApiResult;
import com.qiang.knowledge.service.entity.SysUser;
import com.qiang.knowledge.service.service.SysUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Manager authentication controller for login, logout, and current-user endpoints.
 */
@RestController
@RequestMapping("/api")
public class ManagerController {

    private final SysUserService userService;

    /**
     * Builds the authentication controller with the user business service.
     */
    public ManagerController(SysUserService userService) {
        this.userService = userService;
    }

    /**
     * Validates manager credentials, logs in through Sa-Token, and returns token data.
     */
    @PostMapping("/auth/login")
    public ApiResult<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request == null || !hasText(request.getUsername()) || !hasText(request.getPassword())) {
            return ApiResult.error(400, "username and password are required");
        }
        SysUser user = userService.getByUsername(request.getUsername().trim());
        if (user == null || !userService.passwordMatches(request.getPassword(), user.getPassword())) {
            return ApiResult.error(401, "invalid username or password");
        }
        StpUtil.login(user.getId());
        LoginResponse response = new LoginResponse(StpUtil.getTokenValue(), SysUserResponse.from(user));
        return ApiResult.success(response);
    }

    /**
     * Logs out the current manager user session.
     */
    @PostMapping("/auth/logout")
    public ApiResult<Void> logout() {
        StpUtil.logout();
        return ApiResult.success();
    }

    /**
     * Returns the authenticated manager user's safe profile.
     */
    @GetMapping("/auth/me")
    public ApiResult<SysUserResponse> currentUser() {
        Long userId = Long.valueOf(String.valueOf(StpUtil.getLoginId()));
        return ApiResult.success(SysUserResponse.from(userService.getById(userId)));
    }

    /**
     * Returns true when a string contains non-whitespace text.
     */
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
