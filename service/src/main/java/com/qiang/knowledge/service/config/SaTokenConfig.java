package com.qiang.knowledge.service.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * TODO: Sa-Token 配置占位，后续补充权限码、角色校验和多端登录策略。
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> SaRouter
                .match("/api/**")
                .notMatch("/api/auth/login")
                // TODO: 当前只做 Token 验证占位，后续补充细粒度鉴权。
                .check(StpUtil::checkLogin)))
                .addPathPatterns("/api/**");
    }
}

