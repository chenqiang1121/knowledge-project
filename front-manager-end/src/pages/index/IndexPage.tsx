import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";

/**
 * Manager dashboard landing page shown after successful login.
 */
export function IndexPage() {
  const { t } = useI18n();

  return (
    <section className="page">
      <div className="page-title">
        <h1>{t("dashboard.title")}</h1>
        <span>{t("dashboard.managerWorkspace")}</span>
      </div>
      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/system/users">
          <strong>{t("dashboard.userManager")}</strong>
          <span>{t("dashboard.userCardDescription")}</span>
        </Link>
        <Link className="dashboard-card" to="/system/roles">
          <strong>{t("dashboard.roleManager")}</strong>
          <span>{t("dashboard.roleCardDescription")}</span>
        </Link>
        <Link className="dashboard-card" to="/system/permissions">
          <strong>{t("dashboard.permissionManager")}</strong>
          <span>{t("dashboard.permissionCardDescription")}</span>
        </Link>
      </div>
    </section>
  );
}
