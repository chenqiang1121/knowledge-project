package com.qiang.knowledge.frontapi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * TODO: 知识库后端启动入口，后续补充模块化配置和环境区分。
 */
@SpringBootApplication(scanBasePackages = {
        "com.qiang.knowledge.frontapi",
        "com.qiang.knowledge.service"
})
@MapperScan("com.qiang.knowledge.service.mapper")
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}

