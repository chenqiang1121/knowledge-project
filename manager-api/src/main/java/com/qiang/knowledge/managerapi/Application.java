package com.qiang.knowledge.managerapi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.qiang.knowledge.managerapi",
        "com.qiang.knowledge.service"
})
@MapperScan("com.qiang.knowledge.service.mapper")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
