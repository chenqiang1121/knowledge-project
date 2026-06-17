import { MouseEvent, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../state/AuthContext";
import type { SysMenu } from "../types";

function hasActiveChild(menu: SysMenu, pathname: string): boolean {
  return Boolean(menu.children?.some((child) => child.routePath === pathname || hasActiveChild(child, pathname)));
}

function getMenuLabel(menu: SysMenu, t: ReturnType<typeof useI18n>["t"]) {
  if (!menu.routePath && menu.name === "System Management") {
    return t("layout.systemManagement");
  }
  if (menu.routePath === "/system/users") {
    return t("layout.users");
  }
  if (menu.routePath === "/system/roles") {
    return t("layout.roles");
  }
  if (menu.routePath === "/system/permissions") {
    return t("layout.permissions");
  }
  return menu.name;
}

interface TabItem {
  path: string;
  title: string;
  closable: boolean;
}

interface LayoutProps {
  menus: SysMenu[];
  menuError?: string;
}

function findMenuByPath(menus: SysMenu[], pathname: string): SysMenu | null {
  for (const menu of menus) {
    if (menu.routePath === pathname) {
      return menu;
    }
    const childMatch = findMenuByPath(menu.children ?? [], pathname);
    if (childMatch) {
      return childMatch;
    }
  }
  return null;
}

export function Layout({ menus, menuError = "" }: LayoutProps) {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const dashboardTab = useMemo<TabItem>(() => ({ path: "/", title: t("layout.dashboard"), closable: false }), [t]);
  const [tabs, setTabs] = useState<TabItem[]>([dashboardTab]);

  useEffect(() => {
    setTabs((current) => current.map((tab) => (tab.path === "/" ? dashboardTab : tab)));
  }, [dashboardTab]);

  useEffect(() => {
    if (location.pathname === "/") {
      return;
    }
    const matchedMenu = findMenuByPath(menus, location.pathname);
    if (!matchedMenu) {
      return;
    }
    const title = getMenuLabel(matchedMenu, t);
    setTabs((current) => (current.some((tab) => tab.path === location.pathname) ? current : [...current, { path: location.pathname, title, closable: true }]));
  }, [location.pathname, menus, t]);

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

  function openTab(menu: SysMenu) {
    if (!menu.routePath) {
      return;
    }
    const title = getMenuLabel(menu, t);
    setTabs((current) => (current.some((tab) => tab.path === menu.routePath) ? current : [...current, { path: menu.routePath as string, title, closable: true }]));
    navigate(menu.routePath);
  }

  function closeTab(event: MouseEvent<HTMLButtonElement>, path: string) {
    event.stopPropagation();
    setTabs((current) => {
      const targetIndex = current.findIndex((tab) => tab.path === path);
      const nextTabs = current.filter((tab) => tab.path !== path);
      if (location.pathname === path) {
        const fallback = nextTabs[Math.max(0, targetIndex - 1)] ?? nextTabs[nextTabs.length - 1] ?? dashboardTab;
        navigate(fallback.path, { replace: true });
      }
      return nextTabs.length ? nextTabs : [dashboardTab];
    });
  }

  function renderMenu(menu: SysMenu, depth = 0) {
    const children = menu.children ?? [];
    const hasChildren = children.length > 0;
    const hasActiveDescendant = hasActiveChild(menu, location.pathname);
    const isActive = menu.routePath === location.pathname;
    const isOpen = menu.id ? openMenuIds.includes(menu.id) || hasActiveDescendant : hasActiveDescendant;
    const label = getMenuLabel(menu, t);

    if (hasChildren && !menu.routePath) {
      return (
        <div className="nav-group" key={menu.id ?? menu.name}>
          <button className={`nav-parent${isOpen ? " open" : ""}`} type="button" onClick={() => toggleMenu(menu.id)}>
            <span>{label}</span>
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
        <NavLink key={menu.id ?? menu.routePath} to={menu.routePath} onClick={() => openTab(menu)} className={({ isActive: linkActive }) => (linkActive ? "active" : "")}>
          {depth > 0 ? <span className="nav-child-label">{label}</span> : label}
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
          <button className="topbar-icon" type="button" aria-label="Toggle menu">
            ☰
          </button>
          <div className="topbar-spacer" />
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
        <div className="tabbar" role="tablist" aria-label="Open pages">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <div key={tab.path} className={`tab${isActive ? " active" : ""}`} role="presentation">
                <button className="tab-action" type="button" role="tab" aria-selected={isActive} onClick={() => navigate(tab.path)}>
                  <span className="tab-title">{tab.title}</span>
                </button>
                {tab.closable && (
                  <button className="tab-close" type="button" aria-label={`Close ${tab.title}`} onClick={(event) => closeTab(event, tab.path)}>
                    x
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
