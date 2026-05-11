import Header from "../../components/Header";
import { getDocumentDetail } from "../../api/apiClient";

// TODO: 文档详情页占位，后续根据路由 id 拉取文档详情。
export default function DocumentDetailPage() {
  void getDocumentDetail;

  return (
    <main>
      <Header />
      <article>
        <h1>Document Detail</h1>
        <p>TODO: 文档详情占位内容</p>
      </article>
    </main>
  );
}
