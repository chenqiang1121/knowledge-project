import Navbar from "../components/Navbar";
import { getDocuments } from "../api/apiClient";

// TODO: 文档管理占位，后续补充上传、审核、重建索引和删除能力。
export default function DocumentsPage() {
  void getDocuments;

  return (
    <main>
      <Navbar />
      <h1>Documents</h1>
      <p>TODO: 文档管理占位内容</p>
    </main>
  );
}
