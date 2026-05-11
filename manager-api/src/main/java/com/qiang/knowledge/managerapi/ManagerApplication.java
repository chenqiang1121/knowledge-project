package com.qiang.knowledge.managerapi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.qiang.knowledge.managerapi",
        "com.qiang.knowledge.service"
})
@MapperScan("com.qiang.knowledge.service.mapper")
public class ManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManagerApplication.class, args);
    }
}
