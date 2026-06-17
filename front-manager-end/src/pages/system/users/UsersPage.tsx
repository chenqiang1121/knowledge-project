import { FormEvent, useEffect, useState } from "react";
import { SysRoleApi } from "../../../api/sysRoleApi";
import { SysUserApi } from "../../../api/sysUserApi";
import { formatMessage, useI18n } from "../../../i18n/I18nContext";
import type { SysRole, SysUser } from "../../../types";

const emptyUser: SysUser = { username: "", password: "", sysRoleId: undefined };


// http://localhost:5173/system/users

export function UsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<SysUser[]>([]);
  const [roles, setRoles] = useState<SysRole[]>([]);
  const [form, setForm] = useState<SysUser>(emptyUser);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [userPage, rolePage] = await Promise.all([SysUserApi.getSysUsers(), SysRoleApi.getSysRoles()]);
    setUsers(userPage.records);
    setRoles(rolePage.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("users.failedLoad")));
  }, [t]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const payload = { ...form, sysRoleId: form.sysRoleId ? Number(form.sysRoleId) : undefined };
    if (payload.id && !payload.password) {
      delete payload.password;
    }
    try {
      await SysUserApi.saveSysUser(payload);
      setForm(emptyUser);
      setMessage(t("users.saved"));
      await load();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : t("users.failedSave"));
    }
  }

  async function handleDelete(id?: number) {
    if (!id) {
      return;
    }
    await SysUserApi.deleteSysUser(id);
    setMessage(t("users.userDeleted"));
    await load();
  }

  return (
    <section className="page">
      <div className="page-title">
        <h1>{t("users.title")}</h1>
        <span>{formatMessage(t("users.activeCount"), { count: users.length })}</span>
      </div>
      <form className="editor" onSubmit={handleSubmit}>
        <input placeholder={t("users.username")} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        <input
          placeholder={form.id ? t("users.newPasswordOptional") : t("users.password")}
          type="password"
          value={form.password ?? ""}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <select value={form.sysRoleId ?? ""} onChange={(event) => setForm({ ...form, sysRoleId: Number(event.target.value) || undefined })}>
          <option value="">{t("users.selectRole")}</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.roleName}
            </option>
          ))}
        </select>
        <button type="submit">{form.id ? t("common.update") : t("common.create")}</button>
        {form.id && (
          <button className="ghost" type="button" onClick={() => setForm(emptyUser)}>
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
            <th>{t("users.username")}</th>
            <th>{t("users.role")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{roles.find((role) => role.id === user.sysRoleId)?.roleName ?? user.sysRoleId ?? "-"}</td>
              <td className="actions">
                <button type="button" onClick={() => setForm({ ...user, password: "" })}>
                  {t("common.edit")}
                </button>
                <button className="danger" type="button" onClick={() => handleDelete(user.id).catch((exception) => setError(String(exception)))}>
                  {t("common.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
