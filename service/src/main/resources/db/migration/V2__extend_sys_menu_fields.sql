ALTER TABLE sys_menu
    ADD COLUMN IF NOT EXISTS menu_type VARCHAR(20) DEFAULT 'MENU',
    ADD COLUMN IF NOT EXISTS permission_code VARCHAR(200),
    ADD COLUMN IF NOT EXISTS icon VARCHAR(100),
    ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS refresh BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS open_type VARCHAR(20) DEFAULT 'TAB';

COMMENT ON COLUMN sys_menu.menu_type IS 'Menu node type: DIR, MENU, or BUTTON';
COMMENT ON COLUMN sys_menu.permission_code IS 'Backend permission code';
COMMENT ON COLUMN sys_menu.icon IS 'Menu icon CSS class';
COMMENT ON COLUMN sys_menu.visible IS 'Whether this menu is visible';
COMMENT ON COLUMN sys_menu.refresh IS 'Whether page content should refresh';
COMMENT ON COLUMN sys_menu.open_type IS 'Open target mode';

UPDATE sys_menu
SET menu_type = CASE
        WHEN is_menu = FALSE THEN 'BUTTON'
        WHEN route_path IS NULL THEN 'DIR'
        ELSE 'MENU'
    END,
    visible = COALESCE(visible, TRUE),
    refresh = COALESCE(refresh, FALSE),
    open_type = COALESCE(open_type, 'TAB');
