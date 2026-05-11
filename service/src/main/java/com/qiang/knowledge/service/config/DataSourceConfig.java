package com.qiang.knowledge.service.config;

import org.springframework.context.annotation.Configuration;

/**
 * TODO: PostgreSQL + pgvector 数据源配置占位。
 *
 * 后续建议：
 * 1. 在 application.yml 中配置连接池、schema、Flyway 开关。
 * 2. 使用 pgvector 扩展存储 embedding，按模型维度创建 vector(n) 字段。
 * 3. 为向量表添加 ivfflat 或 hnsw 索引。
 */
@Configuration
public class DataSourceConfig {
}

