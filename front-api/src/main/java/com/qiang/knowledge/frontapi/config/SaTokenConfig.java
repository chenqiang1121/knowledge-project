package com.qiang.knowledge.frontapi.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * TODO: 用户端 Sa-Token 配置，后续按用户端登录态和公开知识库策略细化。
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> SaRouter
                .match("/api/knowledge/**")
                .notMatch("/api/knowledge/search")
                // TODO: 当前搜索接口公开，详情接口需要登录；后续按文档权限细化。
                .check(StpUtil::checkLogin)))
                .addPathPatterns("/api/knowledge/**");
    }
}
