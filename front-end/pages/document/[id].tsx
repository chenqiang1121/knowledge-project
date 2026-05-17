import { getDocumentDetail } from "../../api/apiClient";
import Header from "../../components/Header";
import { useI18n } from "../../i18n/I18nContext";

/**
 * Public document detail page placeholder for future route-based document loading.
 */
export default function DocumentDetailPage() {
  const { t } = useI18n();
  void getDocumentDetail;

  return (
    <main>
      <Header />
      <article>
        <h1>{t("document.title")}</h1>
        <p>{t("document.detailPlaceholder")}</p>
      </article>
    </main>
  );
}
