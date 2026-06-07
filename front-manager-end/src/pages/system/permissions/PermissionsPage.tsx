import { FormEvent, useEffect, useState } from "react";
import { deletePermission, getPermissions, savePermission } from "../../../api/apiClient";
import { formatMessage, useI18n } from "../../../i18n/I18nContext";
import type { Permission } from "../../../types";

const emptyPermission: Permission = {
  name: "",
  url: "",
  parentId: undefined,
  isMenu: true,
  sortOrder: 0,
  routePath: "",
  componentPath: "",
};

export function PermissionsPage() {
  const { t } = useI18n();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState<Permission>(emptyPermission);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const page = await getPermissions();
    setPermissions(page.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("permissions.failedLoad")));
  }, [t]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await savePermission({
      ...form,
      parentId: form.parentId ? Number(form.parentId) : undefined,
      isMenu: Boolean(form.isMenu),
      sortOrder: Number(form.sortOrder ?? 0),
      routePath: form.routePath?.trim() || undefined,
      componentPath: form.componentPath?.trim() || undefined,
      url: form.url?.trim() || undefined,
    });
    setForm(emptyPermission);
    setMessage(t("permissions.saved"));
    await load();
  }

  return (
    <section className="page">
      <div className="page-title">
        <h1>{t("permissions.title")}</h1>
        <span>{formatMessage(t("permissions.activeCount"), { count: permissions.length })}</span>
      </div>
      <form className="editor" onSubmit={(event) => handleSubmit(event).catch((exception) => setError(String(exception)))}>
        <input placeholder={t("permissions.name")} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input placeholder={t("common.url")} value={form.url ?? ""} onChange={(event) => setForm({ ...form, url: event.target.value })} />
        <input
          placeholder={t("permissions.routePath")}
          value={form.routePath ?? ""}
          onChange={(event) => setForm({ ...form, routePath: event.target.value })}
        />
        <input
          placeholder={t("permissions.componentPath")}
          value={form.componentPath ?? ""}
          onChange={(event) => setForm({ ...form, componentPath: event.target.value })}
        />
        <input
          min="0"
          placeholder={t("permissions.sortOrder")}
          type="number"
          value={form.sortOrder ?? 0}
          onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
        />
        <select value={form.parentId ?? ""} onChange={(event) => setForm({ ...form, parentId: Number(event.target.value) || undefined })}>
          <option value="">{t("permissions.selectParent")}</option>
          {permissions
            .filter((permission) => permission.id !== form.id)
            .map((permission) => (
              <option key={permission.id} value={permission.id}>
                {permission.name}
              </option>
            ))}
        </select>
        <label className="check-row menu-check">
          <input type="checkbox" checked={form.isMenu ?? false} onChange={(event) => setForm({ ...form, isMenu: event.target.checked })} />
          {t("permissions.isMenu")}
        </label>
        <button type="submit">{form.id ? t("common.update") : t("common.create")}</button>
        {form.id && (
          <button className="ghost" type="button" onClick={() => setForm(emptyPermission)}>
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
            <th>{t("permissions.name")}</th>
            <th>{t("common.url")}</th>
            <th>{t("common.parent")}</th>
            <th>{t("permissions.isMenu")}</th>
            <th>{t("permissions.sortOrder")}</th>
            <th>{t("permissions.routePath")}</th>
            <th>{t("permissions.componentPath")}</th>
            <th>{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id}>
              <td>{permission.id}</td>
              <td>{permission.name}</td>
              <td>{permission.url || "-"}</td>
              <td>{permissions.find((item) => item.id === permission.parentId)?.name ?? permission.parentId ?? "-"}</td>
              <td>{permission.isMenu ? t("common.yes") : t("common.no")}</td>
              <td>{permission.sortOrder ?? 0}</td>
              <td>{permission.routePath || "-"}</td>
              <td>{permission.componentPath || "-"}</td>
              <td className="actions">
                <button type="button" onClick={() => setForm({ ...permission, isMenu: permission.isMenu ?? true, sortOrder: permission.sortOrder ?? 0 })}>
                  {t("common.edit")}
                </button>
                <button className="danger" type="button" onClick={() => permission.id && deletePermission(permission.id).then(load)}>
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
