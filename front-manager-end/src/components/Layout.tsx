import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getMenuTree } from "../api/apiClient";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../state/AuthContext";
import type { Permission } from "../types";

function hasActiveChild(menu: Permission, pathname: string): boolean {
  return Boolean(menu.children?.some((child) => child.routePath === pathname || hasActiveChild(child, pathname)));
}

export function Layout() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Permission[]>([]);
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getMenuTree()
      .then((tree) => {
        if (!isMounted) {
          return;
        }
        setMenus(tree);
        setOpenMenuIds(tree.filter((menu) => hasActiveChild(menu, location.pathname)).map((menu) => menu.id).filter((id): id is number => Boolean(id)));
        setMenuError("");
      })
      .catch((exception) => {
        console.error("Failed to load manager menus", exception);
        if (isMounted) {
          setMenuError(exception instanceof Error ? exception.message : "Failed to load menus");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  function toggleMenu(menuId?: number) {
    if (!menuId) {
      return;
    }
    setOpenMenuIds((current) => (current.includes(menuId) ? current.filter((id) => id !== menuId) : [...current, menuId]));
  }

  function renderMenu(menu: Permission, depth = 0) {
    const children = menu.children ?? [];
    const hasChildren = children.length > 0;
    const isActive = menu.routePath === location.pathname || hasActiveChild(menu, location.pathname);
    const isOpen = menu.id ? openMenuIds.includes(menu.id) || isActive : isActive;

    if (hasChildren && !menu.routePath) {
      return (
        <div className="nav-group" key={menu.id ?? menu.name}>
          <button className={`nav-parent${isActive ? " active" : ""}${isOpen ? " open" : ""}`} type="button" onClick={() => toggleMenu(menu.id)}>
            <span>{menu.name}</span>
            <span className="nav-parent-indicator" aria-hidden="true">
              &gt;
            </span>
          </button>
          <div className={`nav-children${isOpen ? " open" : ""}`}>
            {children.map((child) => renderMenu(child, depth + 1))}
          </div>
        </div>
      );
    }

    if (menu.routePath) {
      return (
        <NavLink key={menu.id ?? menu.routePath} to={menu.routePath} className={({ isActive: linkActive }) => (linkActive ? "active" : "")}>
          {depth > 0 ? <span className="nav-child-label">{menu.name}</span> : menu.name}
        </NavLink>
      );
    }

    return null;
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">{t("layout.brand")}</div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            {t("layout.dashboard")}
          </NavLink>
          {menus.map((menu) => renderMenu(menu))}
          {menuError && <div className="nav-error">{menuError}</div>}
        </nav>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <label className="language-select">
            <span>{t("language.label")}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
              <option value="en">{t("language.english")}</option>
              <option value="zh-CN">{t("language.chinese")}</option>
            </select>
          </label>
          <span>{user?.username ?? t("layout.managerFallback")}</span>
          <button className="ghost" type="button" onClick={handleLogout}>
            {t("layout.logout")}
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
