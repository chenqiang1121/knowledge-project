import Navbar from "../components/Navbar";
import { getUsers } from "../api/apiClient";

// TODO: 用户管理占位，后续使用 Refine resource/list/edit/create 能力。
export default function UsersPage() {
  void getUsers;

  return (
    <main>
      <Navbar />
      <h1>Users</h1>
      <p>TODO: 用户管理占位内容</p>
    </main>
  );
}
