import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { IndexPage } from "./pages/index/IndexPage";
import { LoginPage } from "./pages/login/LoginPage";
import { PermissionsPage } from "./pages/system/permissions/PermissionsPage";
import { RolesPage } from "./pages/system/roles/RolesPage";
import { UsersPage } from "./pages/system/users/UsersPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<IndexPage />} />
        <Route path="system/users" element={<UsersPage />} />
        <Route path="system/roles" element={<RolesPage />} />
        <Route path="system/permissions" element={<PermissionsPage />} />
      </Route>
    </Routes>
  );
}
