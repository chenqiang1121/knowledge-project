import Header from "../components/Header";
import { useI18n } from "../i18n/I18nContext";

/**
 * Public home page placeholder for future recommended documents and search entry.
 */
export default function HomePage() {
  const { t } = useI18n();

  return (
    <main>
      <Header />
      <section>
        <h1>{t("home.title")}</h1>
        <p>{t("home.placeholder")}</p>
      </section>
    </main>
  );
}
