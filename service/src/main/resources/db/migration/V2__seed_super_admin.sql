DO
$$
DECLARE
    super_admin_role_id BIGINT;
    system_menu_id BIGINT;
    user_manager_permission_id BIGINT;
    role_manager_permission_id BIGINT;
    permission_manager_permission_id BIGINT;
    admin_user_id BIGINT;
BEGIN
    SELECT id
    INTO super_admin_role_id
    FROM roles
    WHERE role_name = 'SUPER_ADMIN'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF super_admin_role_id IS NULL THEN
        INSERT INTO roles (role_name, description, create_time, update_time, is_del)
        VALUES ('SUPER_ADMIN', 'Super administrator with all manager page permissions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO super_admin_role_id;
    ELSE
        UPDATE roles
        SET description = 'Super administrator with all manager page permissions.',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = super_admin_role_id;
    END IF;

    SELECT id
    INTO system_menu_id
    FROM permissions
    WHERE route_path IS NULL
      AND name = 'System Management'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF system_menu_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('System Management', NULL, NULL, TRUE, 10, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO system_menu_id;
    ELSE
        UPDATE permissions
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
    INTO user_manager_permission_id
    FROM permissions
    WHERE route_path = '/system/users'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF user_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Users', '/api/user', system_menu_id, TRUE, 10, '/system/users', 'src/pages/system/users/UsersPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO user_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'Users',
            url = '/api/user',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 10,
            route_path = '/system/users',
            component_path = 'src/pages/system/users/UsersPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = user_manager_permission_id;
    END IF;

    SELECT id
    INTO role_manager_permission_id
    FROM permissions
    WHERE route_path = '/system/roles'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF role_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Roles', '/api/role', system_menu_id, TRUE, 20, '/system/roles', 'src/pages/system/roles/RolesPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO role_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'Roles',
            url = '/api/role',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 20,
            route_path = '/system/roles',
            component_path = 'src/pages/system/roles/RolesPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = role_manager_permission_id;
    END IF;

    SELECT id
    INTO permission_manager_permission_id
    FROM permissions
    WHERE route_path = '/system/permissions'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF permission_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, is_menu, sort_order, route_path, component_path, create_time, update_time, is_del)
        VALUES ('Permissions', '/api/permission', system_menu_id, TRUE, 30, '/system/permissions', 'src/pages/system/permissions/PermissionsPage.tsx', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO permission_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'Permissions',
            url = '/api/permission',
            parent_id = system_menu_id,
            is_menu = TRUE,
            sort_order = 30,
            route_path = '/system/permissions',
            component_path = 'src/pages/system/permissions/PermissionsPage.tsx',
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = permission_manager_permission_id;
    END IF;

    INSERT INTO role_permission (role_id, permission_id)
    SELECT super_admin_role_id, permission_id
    FROM (
        VALUES
            (system_menu_id),
            (user_manager_permission_id),
            (role_manager_permission_id),
            (permission_manager_permission_id)
    ) AS seeded_permissions(permission_id)
    WHERE NOT EXISTS (
        SELECT 1
        FROM role_permission
        WHERE role_id = super_admin_role_id
          AND permission_id = seeded_permissions.permission_id
    );

    SELECT id
    INTO admin_user_id
    FROM users
    WHERE username = 'admin'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF admin_user_id IS NULL THEN
        INSERT INTO users (username, password, role_id, create_time, update_time, is_del)
        VALUES ('admin', 'admin123', super_admin_role_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);
    ELSE
        UPDATE users
        SET password = 'admin123',
            role_id = super_admin_role_id,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = admin_user_id;
    END IF;
END
$$;
