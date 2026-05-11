# Knowledge Project Codex Guide

> TODO: 本文件用于约束 Codex/AI 在本仓库中的检索范围、优先阅读路径和开发边界，减少无关上下文占用。

## Project Scope

本项目是知识库系统第一步脚手架，当前只实现骨架和接口占位。

主要模块：

- `front-end/`: 用户端 Next.js + TailwindCSS 占位。
- `front-manager-end/`: 管理端 React + Refine 占位。
- `java-service/`: Java 21 + Spring Boot 3.x + MyBatis-Plus + Sa-Token 后端占位。
- `py-langchain/`: Python FastAPI + LangChain 服务占位。
- `java-service/resources/db/migration/`: Flyway + PostgreSQL + pgvector 初始化 SQL 占位。

## Recommended Reading Order

处理后端问题时优先阅读：

1. `pom.xml`
2. `java-service/Application.java`
3. `java-service/resources/application.yml`
4. `java-service/manager/`
5. `java-service/front-api/`
6. `java-service/service/`
7. `java-service/mapper/`
8. `java-service/entity/`
9. `java-service/resources/db/migration/`

处理用户端问题时优先阅读：

1. `front-end/pages/`
2. `front-end/components/`
3. `front-end/api/apiClient.ts`

处理管理端问题时优先阅读：

1. `front-manager-end/pages/`
2. `front-manager-end/components/`
3. `front-manager-end/api/apiClient.ts`

处理 Python/LangChain 问题时优先阅读：

1. `py-langchain/app.py`
2. `py-langchain/langchain_service.py`

## Context Rules

- 优先检索源码、接口占位、数据库迁移和构建入口。
- 不要主动读取编译产物、依赖目录、IDE 缓存、日志文件、临时文件。
- 不要把 `target/`、`node_modules/`、`.next/`、`dist/`、`build/` 等目录作为上下文。
- 不要把本地数据库、密钥、环境变量文件、IDE 配置当作业务上下文。
- 若需要确认依赖版本，优先读取 `pom.xml`；前端依赖文件尚未生成时，不要假设已存在。
- 当前阶段为脚手架，占位文件中的 `TODO` 是刻意保留的开发提示，不要在无明确需求时清理。

## Build And Run

Java 后端：

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -q -DskipTests compile
```

Spring Boot 启动：

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn spring-boot:run
```

Flyway 默认关闭：

```powershell
$env:FLYWAY_ENABLED='true'
```

TODO: 接入真实 PostgreSQL + pgvector 后再打开 Flyway 迁移。

## Development Notes

- Java 版本目标为 21。
- Spring Boot 使用 3.x。
- REST API 路径占位包括：
  - `/api/auth/*`
  - `/api/user/*`
  - `/api/knowledge/*`
- Sa-Token 当前只保留登录和 Token 校验占位。
- MyBatis-Plus Mapper 当前只继承 `BaseMapper`。
- Python 服务当前只提供 FastAPI 健康检查和 LangChain 检索占位。
- 前端当前只保留页面、组件和 REST API 调用占位。

## Do Not Index

优先忽略以下内容，避免浪费上下文：

- 编译产物：`target/`, `dist/`, `build/`, `.next/`, `out/`
- 依赖目录：`node_modules/`, `.venv/`, `venv/`, `__pycache__/`
- IDE 配置：`.idea/`, `.vscode/`, `*.iml`
- 本地配置：`.env`, `.env.*`, `application-local.yml`
- 本地数据库数据目录：`postgresql/data/`
- 日志和临时文件：`*.log`, `*.tmp`, `*.cache`
- 操作系统文件：`.DS_Store`, `Thumbs.db`

## TODO

- TODO: 后续生成前端 `package.json` 后，把前端构建命令补充到本文件。
- TODO: 后续生成 Python 依赖文件后，把 FastAPI 启动命令补充到本文件。
- TODO: 后续接入数据库后，把 PostgreSQL + pgvector 初始化步骤补充到本文件。
