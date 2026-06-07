import { FormEvent, useEffect, useState } from "react";
import { deleteUser, getRoles, getUsers, saveUser } from "../../../api/apiClient";
import { formatMessage, useI18n } from "../../../i18n/I18nContext";
import type { Role, User } from "../../../types";

const emptyUser: User = { username: "", password: "", roleId: undefined };


// http://localhost:5173/system/users

export function UsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<User>(emptyUser);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [userPage, rolePage] = await Promise.all([getUsers(), getRoles()]);
    setUsers(userPage.records);
    setRoles(rolePage.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("users.failedLoad")));
  }, [t]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const payload = { ...form, roleId: form.roleId ? Number(form.roleId) : undefined };
    if (payload.id && !payload.password) {
      delete payload.password;
    }
    try {
      await saveUser(payload);
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
    await deleteUser(id);
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
        <select value={form.roleId ?? ""} onChange={(event) => setForm({ ...form, roleId: Number(event.target.value) || undefined })}>
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
              <td>{roles.find((role) => role.id === user.roleId)?.roleName ?? user.roleId ?? "-"}</td>
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
