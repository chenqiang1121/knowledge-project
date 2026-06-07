CREATE TABLE users
(
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    password    VARCHAR(100) NOT NULL,
    role_id     BIGINT       NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del      BOOLEAN   DEFAULT FALSE
);

COMMENT ON TABLE users IS 'User accounts';
COMMENT ON COLUMN users.id IS 'User id';
COMMENT ON COLUMN users.username IS 'Login username';
COMMENT ON COLUMN users.password IS 'Password';
COMMENT ON COLUMN users.role_id IS 'Assigned role id';
COMMENT ON COLUMN users.create_time IS 'Create time';
COMMENT ON COLUMN users.update_time IS 'Update time';
COMMENT ON COLUMN users.is_del IS 'Logical delete marker';

CREATE TABLE roles
(
    id          BIGSERIAL PRIMARY KEY,
    role_name   VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del      BOOLEAN   DEFAULT FALSE
);

COMMENT ON TABLE roles IS 'Roles';
COMMENT ON COLUMN roles.id IS 'Role id';
COMMENT ON COLUMN roles.role_name IS 'Role name';
COMMENT ON COLUMN roles.description IS 'Role description';
COMMENT ON COLUMN roles.create_time IS 'Create time';
COMMENT ON COLUMN roles.update_time IS 'Update time';
COMMENT ON COLUMN roles.is_del IS 'Logical delete marker';

CREATE TABLE permissions
(
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(50) NOT NULL,
    url            VARCHAR(200),
    parent_id      BIGINT    DEFAULT NULL,
    is_menu        BOOLEAN   DEFAULT TRUE,
    sort_order     INTEGER   DEFAULT 0,
    route_path     VARCHAR(200),
    component_path VARCHAR(300),
    create_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del         BOOLEAN   DEFAULT FALSE
);

COMMENT ON TABLE permissions IS 'Permissions and manager menu nodes';
COMMENT ON COLUMN permissions.id IS 'Permission id';
COMMENT ON COLUMN permissions.name IS 'Permission or menu display name';
COMMENT ON COLUMN permissions.url IS 'Protected resource URL';
COMMENT ON COLUMN permissions.parent_id IS 'Parent permission id for menu tree';
COMMENT ON COLUMN permissions.is_menu IS 'Whether this permission is shown as a menu';
COMMENT ON COLUMN permissions.sort_order IS 'Menu sort order';
COMMENT ON COLUMN permissions.route_path IS 'Frontend route path';
COMMENT ON COLUMN permissions.component_path IS 'Frontend TSX source path';
COMMENT ON COLUMN permissions.create_time IS 'Create time';
COMMENT ON COLUMN permissions.update_time IS 'Update time';
COMMENT ON COLUMN permissions.is_del IS 'Logical delete marker';

CREATE TABLE role_permission
(
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

COMMENT ON TABLE role_permission IS 'Role-permission assignments';
COMMENT ON COLUMN role_permission.role_id IS 'Role id';
COMMENT ON COLUMN role_permission.permission_id IS 'Permission id';
