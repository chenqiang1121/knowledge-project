import { FormEvent, useEffect, useState } from "react";
import { SysMenuApi } from "../../../api/sysMenuApi";
import { SysRoleApi } from "../../../api/sysRoleApi";
import { formatMessage, useI18n } from "../../../i18n/I18nContext";
import type { SysMenu, SysRole } from "../../../types";

const emptyRole: SysRole = { roleName: "", description: "" };

export function RolesPage() {
  const { t } = useI18n();
  const [roles, setRoles] = useState<SysRole[]>([]);
  const [permissions, setPermissions] = useState<SysMenu[]>([]);
  const [form, setForm] = useState<SysRole>(emptyRole);
  const [selectedRole, setSelectedRole] = useState<SysRole | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const [rolePage, permissionPage] = await Promise.all([SysRoleApi.getSysRoles(), SysMenuApi.getSysMenus()]);
    setRoles(rolePage.records);
    setPermissions(permissionPage.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("roles.failedLoad")));
  }, [t]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await SysRoleApi.saveSysRole(form);
    setForm(emptyRole);
    setMessage(t("roles.saved"));
    await load();
  }

  async function openPermissions(role: SysRole) {
    if (!role.id) {
      return;
    }
    setSelectedRole(role);
    setSelectedPermissionIds(await SysRoleApi.getSysRoleMenus(role.id));
  }

  function togglePermission(sysMenuId?: number) {
    if (!sysMenuId) {
      return;
    }
    setSelectedPermissionIds((current) =>
      current.includes(sysMenuId) ? current.filter((id) => id !== sysMenuId) : [...current, sysMenuId],
    );
  }

  async function persistPermissions() {
    if (!selectedRole?.id) {
      return;
    }
    await SysRoleApi.saveSysRoleMenus(selectedRole.id, selectedPermissionIds);
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
                <button className="danger" type="button" onClick={() => role.id && SysRoleApi.deleteSysRole(role.id).then(load)}>
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
