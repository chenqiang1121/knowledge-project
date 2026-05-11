import Header from "../components/Header";
import { searchKnowledge } from "../api/apiClient";

// TODO: 搜索页占位，后续接入输入框、筛选条件和搜索结果列表。
export default function SearchPage() {
  void searchKnowledge;

  return (
    <main>
      <Header />
      <section>
        <h1>Search</h1>
        <p>TODO: 搜索页占位内容</p>
      </section>
    </main>
  );
}
