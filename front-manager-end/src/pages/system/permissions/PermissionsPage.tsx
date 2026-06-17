import { FormEvent, useEffect, useMemo, useState } from "react";
import { deleteSysMenu, getSysMenus, saveSysMenu } from "../../../api/apiClient";
import { useI18n } from "../../../i18n/I18nContext";
import type { SysMenu } from "../../../types";

type MenuType = NonNullable<SysMenu["menuType"]>;

const emptyPermission: SysMenu = {
  name: "",
  url: "",
  parentId: undefined,
  isMenu: true,
  menuType: "MENU",
  sortOrder: 0,
  routePath: "",
  componentPath: "",
  permissionCode: "",
  icon: "",
  visible: true,
  refresh: false,
  openType: "TAB",
};

function getMenuTypeLabel(menuType?: MenuType) {
  if (menuType === "DIR") {
    return "目录";
  }
  if (menuType === "BUTTON") {
    return "按钮";
  }
  return "菜单";
}

function getParentName(permissions: SysMenu[], parentId?: number | null) {
  return permissions.find((item) => item.id === parentId)?.name ?? (parentId ? String(parentId) : "无");
}

function inferMenuType(permission: SysMenu): MenuType {
  return permission.menuType ?? (permission.isMenu === false ? "BUTTON" : permission.routePath ? "MENU" : "DIR");
}

export function PermissionsPage() {
  const { t } = useI18n();
  const [permissions, setPermissions] = useState<SysMenu[]>([]);
  const [form, setForm] = useState<SysMenu>(emptyPermission);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ name: "", visible: "ALL" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const menuType = (form.menuType ?? "MENU") as MenuType;
  const isDirectory = menuType === "DIR";
  const isPageMenu = menuType === "MENU";
  const isButton = menuType === "BUTTON";
  const selectedPermission = permissions.find((permission) => permission.id === selectedPermissionId);
  const filteredPermissions = useMemo(
    () =>
      permissions.filter((permission) => {
        const keyword = filters.name.trim().toLowerCase();
        const matchesName = !keyword || permission.name.toLowerCase().includes(keyword);
        const matchesVisible =
          filters.visible === "ALL" || (filters.visible === "VISIBLE" ? permission.visible !== false : permission.visible === false);
        return matchesName && matchesVisible;
      }),
    [filters.name, filters.visible, permissions],
  );

  async function load() {
    const page = await getSysMenus();
    setPermissions(page.records);
  }

  useEffect(() => {
    load().catch((exception) => setError(exception instanceof Error ? exception.message : t("permissions.failedLoad")));
  }, [t]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
  }

  function resetFilters() {
    setFilters({ name: "", visible: "ALL" });
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setForm(emptyPermission);
  }

  function openCreateDialog() {
    setForm(emptyPermission);
    setIsDialogOpen(true);
  }

  function openEditDialog(permission: SysMenu) {
    const nextMenuType = inferMenuType(permission);
    setSelectedPermissionId(permission.id ?? null);
    setForm({
      ...permission,
      isMenu: permission.isMenu ?? nextMenuType !== "BUTTON",
      menuType: nextMenuType,
      sortOrder: permission.sortOrder ?? 0,
      visible: permission.visible ?? true,
      refresh: permission.refresh ?? false,
      openType: permission.openType ?? "TAB",
    });
    setIsDialogOpen(true);
  }

  function openSelectedEditDialog() {
    if (selectedPermission) {
      openEditDialog(selectedPermission);
    }
  }

  function updateMenuType(nextMenuType: MenuType) {
    setForm({
      ...form,
      menuType: nextMenuType,
      isMenu: nextMenuType !== "BUTTON",
      url: nextMenuType === "DIR" ? "" : form.url,
      routePath: nextMenuType === "BUTTON" ? "" : form.routePath,
      componentPath: nextMenuType === "BUTTON" ? "" : form.componentPath,
      icon: nextMenuType === "BUTTON" ? "" : form.icon,
      openType: nextMenuType === "MENU" ? form.openType ?? "TAB" : "",
      refresh: nextMenuType === "MENU" ? form.refresh ?? false : false,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextMenuType = (form.menuType ?? "MENU") as MenuType;
    await saveSysMenu({
      ...form,
      parentId: form.parentId ? Number(form.parentId) : null,
      isMenu: nextMenuType !== "BUTTON",
      menuType: nextMenuType,
      sortOrder: Number(form.sortOrder ?? 0),
      routePath: nextMenuType === "BUTTON" ? "" : form.routePath?.trim() || "",
      componentPath: nextMenuType === "BUTTON" ? "" : form.componentPath?.trim() || "",
      url: nextMenuType === "DIR" ? "" : form.url?.trim() || "",
      permissionCode: nextMenuType === "DIR" ? "" : form.permissionCode?.trim() || "",
      icon: nextMenuType === "BUTTON" ? "" : form.icon?.trim() || "",
      visible: form.visible ?? true,
      refresh: nextMenuType === "MENU" ? Boolean(form.refresh) : false,
      openType: nextMenuType === "MENU" ? form.openType ?? "TAB" : "",
    });
    setIsDialogOpen(false);
    setForm(emptyPermission);
    setMessage(t("permissions.saved"));
    await load();
  }

  return (
    <section className="page permissions-page">
      <form className="query-panel" onSubmit={handleSearch}>
        <label>
          <span>菜单名称：</span>
          <input value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} />
        </label>
        <label>
          <span>菜单状态：</span>
          <select value={filters.visible} onChange={(event) => setFilters({ ...filters, visible: event.target.value })}>
            <option value="ALL">所有</option>
            <option value="VISIBLE">显示</option>
            <option value="HIDDEN">隐藏</option>
          </select>
        </label>
        <button type="submit">搜索</button>
        <button className="warning" type="button" onClick={resetFilters}>
          重置
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <div className="table-panel">
        <div className="table-toolbar">
          <div className="toolbar-actions">
            <button type="button" onClick={openCreateDialog}>
              + 新增
            </button>
            <button className="success-button" type="button" disabled={!selectedPermission} onClick={openSelectedEditDialog}>
              修改
            </button>
            <button className="teal" type="button">
              保存排序
            </button>
            <button className="ghost" type="button">
              展开/折叠
            </button>
          </div>
          <div className="toolbar-tools">
            <button className="ghost icon-button" type="button" aria-label="搜索">
              ⌕
            </button>
            <button className="ghost icon-button" type="button" aria-label="刷新" onClick={() => load().catch((exception) => setError(String(exception)))}>
              ↻
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th />
              <th>{t("permissions.name")}</th>
              <th>{t("permissions.sortOrder")}</th>
              <th>请求地址</th>
              <th>类型</th>
              <th>可见</th>
              <th>权限标识</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map((permission) => (
              <tr key={permission.id}>
                <td>
                  <input
                    type="radio"
                    name="selectedPermission"
                    checked={selectedPermissionId === permission.id}
                    onChange={() => setSelectedPermissionId(permission.id ?? null)}
                  />
                </td>
                <td>{permission.icon ? `${permission.icon} ` : ""}{permission.name}</td>
                <td>{permission.sortOrder ?? 0}</td>
                <td>{permission.url || permission.routePath || "-"}</td>
                <td>
                  <span className="status-badge">{getMenuTypeLabel(inferMenuType(permission))}</span>
                </td>
                <td>
                  <span className="status-badge">{permission.visible === false ? "隐藏" : "显示"}</span>
                </td>
                <td>{permission.permissionCode || "-"}</td>
                <td className="actions">
                  <button type="button" onClick={() => openEditDialog(permission)}>
                    编辑
                  </button>
                  <button className="danger" type="button" onClick={() => permission.id && deleteSysMenu(permission.id).then(load)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal menu-modal" role="dialog" aria-modal="true" aria-labelledby="permission-dialog-title">
            <div className="modal-header">
              <h2 id="permission-dialog-title">{form.id ? "修改菜单" : "新增菜单"}</h2>
              <button className="ghost modal-close" type="button" aria-label={t("common.cancel")} onClick={closeDialog}>
                x
              </button>
            </div>
            <form className="modal-form menu-modal-form" onSubmit={(event) => handleSubmit(event).catch((exception) => setError(String(exception)))}>
              <label className="form-row">
                <span>上级菜单：</span>
                <div className="parent-picker">
                  <select value={form.parentId ?? ""} onChange={(event) => setForm({ ...form, parentId: Number(event.target.value) || undefined })}>
                    <option value="">无</option>
                    {permissions
                      .filter((permission) => permission.id !== form.id && inferMenuType(permission) !== "BUTTON")
                      .map((permission) => (
                        <option key={permission.id} value={permission.id}>
                          {permission.name}
                        </option>
                      ))}
                  </select>
                  <button className="ghost parent-search" type="button" aria-label="选择上级菜单">
                    ⌕
                  </button>
                </div>
              </label>

              <fieldset className="form-row radio-row">
                <legend>
                  <span className="required">*</span> 菜单类型：
                </legend>
                <div className="radio-options">
                  <label>
                    <input name="menuType" type="radio" checked={menuType === "DIR"} onChange={() => updateMenuType("DIR")} />
                    目录
                  </label>
                  <label>
                    <input name="menuType" type="radio" checked={menuType === "MENU"} onChange={() => updateMenuType("MENU")} />
                    菜单
                  </label>
                  <label>
                    <input name="menuType" type="radio" checked={menuType === "BUTTON"} onChange={() => updateMenuType("BUTTON")} />
                    按钮
                  </label>
                </div>
              </fieldset>

              <label className="form-row">
                <span>
                  <span className="required">*</span> 菜单名称：
                </span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>

              {!isDirectory && (
                <label className="form-row">
                  <span>{isPageMenu && <span className="required">*</span>} 请求地址：</span>
                  <input value={form.url ?? ""} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder={isPageMenu ? "/system/users" : ""} />
                </label>
              )}

              {isPageMenu && (
                <>
                  <label className="form-row">
                    <span>路由地址：</span>
                    <input value={form.routePath ?? ""} onChange={(event) => setForm({ ...form, routePath: event.target.value })} placeholder="/system/users" />
                  </label>
                  <label className="form-row">
                    <span>TSX 地址：</span>
                    <input
                      value={form.componentPath ?? ""}
                      onChange={(event) => setForm({ ...form, componentPath: event.target.value })}
                      placeholder="system/users/UsersPage.tsx"
                    />
                  </label>
                  <label className="form-row">
                    <span>打开方式：</span>
                    <select value={form.openType ?? "TAB"} onChange={(event) => setForm({ ...form, openType: event.target.value as SysMenu["openType"] })}>
                      <option value="TAB">页签</option>
                      <option value="CURRENT">当前窗口</option>
                      <option value="NEW_WINDOW">新窗口</option>
                    </select>
                  </label>
                </>
              )}

              {!isDirectory && (
                <label className="form-row form-row-with-help">
                  <span>权限标识：</span>
                  <input value={form.permissionCode ?? ""} onChange={(event) => setForm({ ...form, permissionCode: event.target.value })} />
                  <em>ⓘ 控制器中定义的权限标识，如：@RequiresPermissions("")</em>
                </label>
              )}

              <label className="form-row">
                <span>
                  <span className="required">*</span> 显示排序：
                </span>
                <input min="0" type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
              </label>

              {!isButton && (
                <label className="form-row">
                  <span>图标：</span>
                  <input value={form.icon ?? ""} onChange={(event) => setForm({ ...form, icon: event.target.value })} placeholder="fa fa-gear" />
                </label>
              )}

              <fieldset className="form-row radio-row inline-radio-row">
                <legend>菜单状态：</legend>
                <div className="radio-options">
                  <label>
                    <input name="visible" type="radio" checked={form.visible ?? true} onChange={() => setForm({ ...form, visible: true })} />
                    显示
                  </label>
                  <label>
                    <input name="visible" type="radio" checked={form.visible === false} onChange={() => setForm({ ...form, visible: false })} />
                    隐藏
                  </label>
                </div>
              </fieldset>

              {isPageMenu && (
                <fieldset className="form-row radio-row inline-radio-row">
                  <legend>是否刷新：</legend>
                  <div className="radio-options">
                    <label>
                      <input name="refresh" type="radio" checked={!form.refresh} onChange={() => setForm({ ...form, refresh: false })} />
                      否
                    </label>
                    <label>
                      <input name="refresh" type="radio" checked={Boolean(form.refresh)} onChange={() => setForm({ ...form, refresh: true })} />
                      是
                    </label>
                  </div>
                </fieldset>
              )}

              <div className="modal-actions">
                <button type="submit">确定</button>
                <button className="ghost" type="button" onClick={closeDialog}>
                  关闭
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
