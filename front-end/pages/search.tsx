import { searchKnowledge } from "../api/apiClient";
import Header from "../components/Header";
import { useI18n } from "../i18n/I18nContext";

/**
 * Public search page placeholder for future query inputs, filters, and results.
 */
export default function SearchPage() {
  const { t } = useI18n();
  void searchKnowledge;

  return (
    <main>
      <Header />
      <section>
        <h1>{t("search.title")}</h1>
        <p>{t("search.placeholder")}</p>
      </section>
    </main>
  );
}
