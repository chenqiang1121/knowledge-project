import { FormEvent, useEffect, useState } from "react";
import { deleteRole, getPermissions, getRolePermissions, getRoles, saveRole, saveRolePermissions } from "../../../api/apiClient";
import { formatMessage, useI18n } from "../../../i18n/I18nContext";
import type { Permission, Role } from "../../../types";

const emptyRole: Role = { roleName: "", description: "" };

export function RolesPage() {
  const { t } = useI18n();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState<Role>(emptyRole);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [rolePage, permissionPage] = await Promise.all([getRoles(), getPermissions()]);
    setRoles(rolePage.records);
    setPermissions(permissionPage.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("roles.failedLoad")));
  }, [t]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await saveRole(form);
    setForm(emptyRole);
    setMessage(t("roles.saved"));
    await load();
  }

  async function openPermissions(role: Role) {
    if (!role.id) {
      return;
    }
    setSelectedRole(role);
    setSelectedPermissionIds(await getRolePermissions(role.id));
  }

  function togglePermission(permissionId?: number) {
    if (!permissionId) {
      return;
    }
    setSelectedPermissionIds((current) =>
      current.includes(permissionId) ? current.filter((id) => id !== permissionId) : [...current, permissionId],
    );
  }

  async function persistPermissions() {
    if (!selectedRole?.id) {
      return;
    }
    await saveRolePermissions(selectedRole.id, selectedPermissionIds);
    setMessage(t("roles.permissionsSaved"));
  }

  return (
    <section className="page">
      <div className="page-title">
        <h1>{t("roles.title")}</h1>
        <span>{formatMessage(t("roles.activeCount"), { count: roles.length })}</span>
      </div>
      <form className="editor" onSubmit={(event) => handleSubmit(event).catch((exception) => setError(String(exception)))}>
        <input placeholder={t("roles.namePlaceholder")} value={form.roleName} onChange={(event) => setForm({ ...form, roleName: event.target.value })} />
        <input
          placeholder={t("common.description")}
          value={form.description ?? ""}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <button type="submit">{form.id ? t("common.update") : t("common.create")}</button>
        {form.id && (
          <button className="ghost" type="button" onClick={() => setForm(emptyRole)}>
            {t("common.cancel")}
          </button>
        )}
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <table>
        <thead>
          <tr>
            <th>{t("common.id")}</th>
            <th>{t("roles.name")}</th>
            <th>{t("common.description")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.roleName}</td>
              <td>{role.description || "-"}</td>
              <td className="actions">
                <button type="button" onClick={() => setForm(role)}>
                  {t("common.edit")}
                </button>
                <button type="button" onClick={() => openPermissions(role).catch((exception) => setError(String(exception)))}>
                  {t("roles.permissions")}
                </button>
                <button className="danger" type="button" onClick={() => role.id && deleteRole(role.id).then(load)}>
                  {t("common.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRole && (
        <section className="assignment">
          <h2>{formatMessage(t("roles.permissionsHeading"), { role: selectedRole.roleName })}</h2>
          <div className="permission-grid">
            {permissions.map((permission) => (
              <label key={permission.id} className="check-row">
                <input
                  type="checkbox"
                  checked={permission.id ? selectedPermissionIds.includes(permission.id) : false}
                  onChange={() => togglePermission(permission.id)}
                />
                {permission.name}
              </label>
            ))}
          </div>
          <button type="button" onClick={() => persistPermissions().catch((exception) => setError(String(exception)))}>
            {t("roles.savePermissions")}
          </button>
        </section>
      )}
    </section>
  );
}
