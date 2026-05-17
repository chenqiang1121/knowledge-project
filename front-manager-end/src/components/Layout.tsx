import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../state/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const isSystemRoute = location.pathname.startsWith("/system/");
  const [isSystemOpen, setIsSystemOpen] = useState(isSystemRoute);
  const showSystemLinks = isSystemOpen || isSystemRoute;
  const systemToggleClassName = useMemo(
    () => `nav-parent${isSystemRoute ? " active" : ""}${showSystemLinks ? " open" : ""}`,
    [isSystemRoute, showSystemLinks],
  );
  const systemLinks = [
    { to: "/system/users", label: t("layout.users") },
    { to: "/system/roles", label: t("layout.roles") },
    { to: "/system/permissions", label: t("layout.permissions") },
  ];

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">{t("layout.brand")}</div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            {t("layout.dashboard")}
          </NavLink>
          <button className={systemToggleClassName} type="button" onClick={() => setIsSystemOpen((current) => !current)}>
            <span>{t("layout.systemManagement")}</span>
            <span className="nav-parent-indicator" aria-hidden="true">
              ›
            </span>
          </button>
          <div className={`nav-children${showSystemLinks ? " open" : ""}`}>
            {systemLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {link.label}
              </NavLink>
            ))}
          </div>
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
