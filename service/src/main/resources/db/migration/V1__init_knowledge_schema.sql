DROP TABLE IF EXISTS sys_role_menu, sys_user, sys_role, sys_menu CASCADE;

CREATE TABLE sys_user
(
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    password    VARCHAR(100) NOT NULL,
    sys_role_id     BIGINT       NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del      BOOLEAN   DEFAULT FALSE
);

COMMENT ON TABLE sys_user IS 'User accounts';
COMMENT ON COLUMN sys_user.id IS 'User id';
COMMENT ON COLUMN sys_user.username IS 'Login username';
COMMENT ON COLUMN sys_user.password IS 'Password';
COMMENT ON COLUMN sys_user.sys_role_id IS 'Assigned role id';
COMMENT ON COLUMN sys_user.create_time IS 'Create time';
COMMENT ON COLUMN sys_user.update_time IS 'Update time';
COMMENT ON COLUMN sys_user.is_del IS 'Logical delete marker';

CREATE TABLE sys_role
(
    id          BIGSERIAL PRIMARY KEY,
    role_name   VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_del      BOOLEAN   DEFAULT FALSE
);

COMMENT ON TABLE sys_role IS 'sys_role';
COMMENT ON COLUMN sys_role.id IS 'Role id';
COMMENT ON COLUMN sys_role.role_name IS 'Role name';
COMMENT ON COLUMN sys_role.description IS 'Role description';
COMMENT ON COLUMN sys_role.create_time IS 'Create time';
COMMENT ON COLUMN sys_role.update_time IS 'Update time';
COMMENT ON COLUMN sys_role.is_del IS 'Logical delete marker';

CREATE TABLE sys_menu
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

COMMENT ON TABLE sys_menu IS 'System menus and manager menu nodes';
COMMENT ON COLUMN sys_menu.id IS 'Menu id';
COMMENT ON COLUMN sys_menu.name IS 'Menu display name';
COMMENT ON COLUMN sys_menu.url IS 'Protected resource URL';
COMMENT ON COLUMN sys_menu.parent_id IS 'Parent menu id for menu tree';
COMMENT ON COLUMN sys_menu.is_menu IS 'Whether this row is shown as a menu';
COMMENT ON COLUMN sys_menu.sort_order IS 'Menu sort order';
COMMENT ON COLUMN sys_menu.route_path IS 'Frontend route path';
COMMENT ON COLUMN sys_menu.component_path IS 'Frontend TSX source path';
COMMENT ON COLUMN sys_menu.create_time IS 'Create time';
COMMENT ON COLUMN sys_menu.update_time IS 'Update time';
COMMENT ON COLUMN sys_menu.is_del IS 'Logical delete marker';

CREATE TABLE sys_role_menu
(
    sys_role_id       BIGINT NOT NULL,
    sys_menu_id BIGINT NOT NULL,
    PRIMARY KEY (sys_role_id, sys_menu_id)
);

COMMENT ON TABLE sys_role_menu IS 'Role-menu assignments';
COMMENT ON COLUMN sys_role_menu.sys_role_id IS 'Role id';
COMMENT ON COLUMN sys_role_menu.sys_menu_id IS 'Menu id';

DO
$$
DECLARE
    super_admin_sys_role_id BIGINT;
    system_menu_id BIGINT;
    user_manager_sys_menu_id BIGINT;
    role_manager_sys_menu_id BIGINT;
    permission_manager_sys_menu_id BIGINT;
    admin_user_id BIGINT;
BEGIN
    SELECT id
    INTO super_admin_sys_role_id
    FROM sys_role
    WHERE role_name = 'SUPER_ADMIN'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF super_admin_sys_role_id IS NULL THEN
        INSERT INTO sys_role (role_name, description, create_time, update_time, is_del)
        VALUES ('SUPER_ADMIN', 'Super administrator with all manager page menus.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO super_admin_sys_role_id;
    ELSE
        UPDATE sys_role
        SET description = 'Super administrator with all manager page menus.',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = super_admin_sys_role_id;
    END IF;

    SELECT id
    INTO system_menu_id
    FROM sys_menu
    WHERE route_path IS NULL
      AND name = 'System Management'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF system_menu_id IS NULL THEN
        INSERT INTO sys_menu (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('System Management', NULL, NULL, TRUE, 10, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO system_menu_id;
    ELSE
        UPDATE sys_menu
        SET name = 'System Management',
            url = NULL,
            parent_id = NULL,
            is_menu = TRUE,
            sort_order = 10,
            route_path = NULL,
            component_path = NULL,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = system_menu_id;
    END IF;

    SELECT id
    INTO user_manager_sys_menu_id
    FROM sys_menu
    WHERE route_path = '/system/users'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF user_manager_sys_menu_id IS NULL THEN
        INSERT INTO sys_menu (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Users', '/api/sys-user', system_menu_id, TRUE, 10, '/system/users', 'src/pages/system/users/UsersPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO user_manager_sys_menu_id;
    ELSE
        UPDATE sys_menu
        SET name = 'Users',
            url = '/api/sys-user',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 10,
            route_path = '/system/users',
            component_path = 'src/pages/system/users/UsersPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = user_manager_sys_menu_id;
    END IF;

    SELECT id
    INTO role_manager_sys_menu_id
    FROM sys_menu
    WHERE route_path = '/system/roles'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF role_manager_sys_menu_id IS NULL THEN
        INSERT INTO sys_menu (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Roles', '/api/sys-role', system_menu_id, TRUE, 20, '/system/roles', 'src/pages/system/roles/RolesPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO role_manager_sys_menu_id;
    ELSE
        UPDATE sys_menu
        SET name = 'Roles',
            url = '/api/sys-role',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 20,
            route_path = '/system/roles',
            component_path = 'src/pages/system/roles/RolesPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = role_manager_sys_menu_id;
    END IF;

    SELECT id
    INTO permission_manager_sys_menu_id
    FROM sys_menu
    WHERE route_path = '/system/permissions'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF permission_manager_sys_menu_id IS NULL THEN
        INSERT INTO sys_menu (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Menus', '/api/sys-menu', system_menu_id, TRUE, 30, '/system/permissions', 'src/pages/system/permissions/PermissionsPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO permission_manager_sys_menu_id;
    ELSE
        UPDATE sys_menu
        SET name = 'Menus',
            url = '/api/sys-menu',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 30,
            route_path = '/system/permissions',
            component_path = 'src/pages/system/permissions/PermissionsPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = permission_manager_sys_menu_id;
    END IF;

    INSERT INTO sys_role_menu (sys_role_id, sys_menu_id)
    SELECT super_admin_sys_role_id, sys_menu_id
    FROM (
        VALUES
            (system_menu_id),
            (user_manager_sys_menu_id),
            (role_manager_sys_menu_id),
            (permission_manager_sys_menu_id)
    ) AS seeded_sys_menus(sys_menu_id)
    WHERE NOT EXISTS (
        SELECT 1
        FROM sys_role_menu
        WHERE sys_role_id = super_admin_sys_role_id
          AND sys_menu_id = seeded_sys_menus.sys_menu_id
    );

    SELECT id
    INTO admin_user_id
    FROM sys_user
    WHERE username = 'admin'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF admin_user_id IS NULL THEN
        INSERT INTO sys_user (username, password, sys_role_id, create_time, update_time, is_del)
        VALUES ('admin', 'admin123', super_admin_sys_role_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);
    ELSE
        UPDATE sys_user
        SET password = 'admin123',
            sys_role_id = super_admin_sys_role_id,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = admin_user_id;
    END IF;
END
$$;
