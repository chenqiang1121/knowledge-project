-- Seed a usable super admin account for the manager frontend.
-- The current login implementation compares the plain password stored in users.password.

DO
$$
DECLARE
    super_admin_role_id BIGINT;
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
    INTO user_manager_permission_id
    FROM permissions
    WHERE url = '/users'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF user_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, create_time, update_time, is_del)
        VALUES ('User Manager', '/users', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO user_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'User Manager',
            parent_id = NULL,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = user_manager_permission_id;
    END IF;

    SELECT id
    INTO role_manager_permission_id
    FROM permissions
    WHERE url = '/roles'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF role_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, create_time, update_time, is_del)
        VALUES ('Role Manager', '/roles', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO role_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'Role Manager',
            parent_id = NULL,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = role_manager_permission_id;
    END IF;

    SELECT id
    INTO permission_manager_permission_id
    FROM permissions
    WHERE url = '/permissions'
      AND is_del = FALSE
    ORDER BY id
    LIMIT 1;

    IF permission_manager_permission_id IS NULL THEN
        INSERT INTO permissions (name, url, parent_id, create_time, update_time, is_del)
        VALUES ('Permission Manager', '/permissions', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
        RETURNING id INTO permission_manager_permission_id;
    ELSE
        UPDATE permissions
        SET name = 'Permission Manager',
            parent_id = NULL,
            update_time = CURRENT_TIMESTAMP,
            is_del = FALSE
        WHERE id = permission_manager_permission_id;
    END IF;

    INSERT INTO role_permission (role_id, permission_id)
    SELECT super_admin_role_id, permission_id
    FROM (
        VALUES
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
