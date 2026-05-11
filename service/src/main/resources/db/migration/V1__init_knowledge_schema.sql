-- V1__init_tables_bigserial.sql
-- =====================================
-- 用户表、角色表、权限表及关联表
-- 使用 BIGSERIAL 作为自增主键
-- =====================================

-- =======================
-- users 表
-- =======================
CREATE TABLE users
(
    id          BIGSERIAL PRIMARY KEY,               -- 用户ID，自增主键
    username    VARCHAR(50)  NOT NULL,               -- 用户名
    password    VARCHAR(100) NOT NULL,               -- 密码
    role_id     BIGINT       NOT NULL,               -- 用户角色ID
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 更新时间
    is_del      BOOLEAN   DEFAULT FALSE              -- 是否逻辑删除
);

COMMENT
ON TABLE users IS '用户表，存储系统用户信息';
COMMENT
ON COLUMN users.id IS '用户ID，自增主键';
COMMENT
ON COLUMN users.username IS '用户名';
COMMENT
ON COLUMN users.password IS '密码';
COMMENT
ON COLUMN users.role_id IS '用户角色ID';
COMMENT
ON COLUMN users.create_time IS '创建时间';
COMMENT
ON COLUMN users.update_time IS '更新时间';
COMMENT
ON COLUMN users.is_del IS '逻辑删除标记';


-- =======================
-- roles 表
-- =======================
CREATE TABLE roles
(
    id          BIGSERIAL PRIMARY KEY,               -- 角色ID，自增主键
    role_name   VARCHAR(50) NOT NULL,                -- 角色名称
    description VARCHAR(200),                        -- 角色描述
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 更新时间
    is_del      BOOLEAN   DEFAULT FALSE              -- 是否逻辑删除
);

COMMENT
ON TABLE roles IS '角色表，存储系统角色信息';
COMMENT
ON COLUMN roles.id IS '角色ID，自增主键';
COMMENT
ON COLUMN roles.role_name IS '角色名称';
COMMENT
ON COLUMN roles.description IS '角色描述';
COMMENT
ON COLUMN roles.create_time IS '创建时间';
COMMENT
ON COLUMN roles.update_time IS '更新时间';
COMMENT
ON COLUMN roles.is_del IS '逻辑删除标记';


-- =======================
-- permissions 表（菜单/资源）
-- =======================
CREATE TABLE permissions
(
    id          BIGSERIAL PRIMARY KEY,  -- 权限ID，自增主键
    name        VARCHAR(50) NOT NULL,   -- 权限/菜单名称
    url         VARCHAR(200),           -- 前端 URL 或资源路径
    parent_id   BIGINT    DEFAULT NULL, -- 父级权限ID，用于菜单层级
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del      BOOLEAN   DEFAULT FALSE
);

COMMENT
ON TABLE permissions IS '权限表/菜单表，存储系统操作资源或菜单';
COMMENT
ON COLUMN permissions.id IS '权限ID，自增主键';
COMMENT
ON COLUMN permissions.name IS '权限/菜单名称';
COMMENT
ON COLUMN permissions.url IS '权限对应的URL或资源路径';
COMMENT
ON COLUMN permissions.parent_id IS '父级权限ID，用于菜单层级';
COMMENT
ON COLUMN permissions.create_time IS '创建时间';
COMMENT
ON COLUMN permissions.update_time IS '更新时间';
COMMENT
ON COLUMN permissions.is_del IS '逻辑删除标记';


-- =======================
-- role_permission 表（角色-权限关联）
-- =======================
CREATE TABLE role_permission
(
    role_id       BIGINT NOT NULL, -- 角色ID
    permission_id BIGINT NOT NULL, -- 权限ID
    PRIMARY KEY (role_id, permission_id)
);

COMMENT
ON TABLE role_permission IS '角色权限关联表，用于记录每个角色拥有哪些权限';
COMMENT
ON COLUMN role_permission.role_id IS '角色ID';
COMMENT
ON COLUMN role_permission.permission_id IS '权限ID';


-- =======================
-- 默认角色数据
-- =======================
INSERT INTO roles (role_name, description)
VALUES ('SUPER_ADMIN', '超级管理员，拥有所有权限');
