import { useI18n } from "../i18n/I18nContext";

/**
 * Shared public header with the project brand, navigation placeholder, and locale switcher.
 */
export default function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header>
      <strong>{t("header.brand")}</strong>
      <nav>{t("header.navigationPlaceholder")}</nav>
      <label>
        {t("header.language")}
        <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
          <option value="en">{t("header.languageEnglish")}</option>
          <option value="zh-CN">{t("header.languageChinese")}</option>
        </select>
      </label>
    </header>
  );
}
