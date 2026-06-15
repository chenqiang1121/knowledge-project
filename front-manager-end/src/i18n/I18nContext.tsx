import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

/**
 * Provides dependency-free UI localization for the manager frontend.
 * Keep translation keys stable so pages can add languages without changing component logic.
 */
export type Locale = "en" | "zh-CN";

const en = {
  "common.actions": "Actions",
  "common.cancel": "Cancel",
  "common.create": "Create",
  "common.delete": "Delete",
  "common.description": "Description",
  "common.edit": "Edit",
  "common.id": "ID",
  "common.no": "No",
  "common.noParent": "No parent",
  "common.parent": "Parent",
  "common.update": "Update",
  "common.url": "URL",
  "common.yes": "Yes",
  "dashboard.managerWorkspace": "Manager workspace",
  "dashboard.permissionCardDescription": "Configure menu entries and protected resources.",
  "dashboard.permissionManager": "Permission Manager",
  "dashboard.roleCardDescription": "Maintain roles and assign permission menus.",
  "dashboard.roleManager": "Role Manager",
  "dashboard.title": "Dashboard",
  "dashboard.userCardDescription": "Manage manager accounts and role ownership.",
  "dashboard.userManager": "User Manager",
  "language.english": "English",
  "language.label": "Language",
  "language.chinese": "Chinese",
  "layout.brand": "Knowledge Manager",
  "layout.dashboard": "Dashboard",
  "layout.logout": "Logout",
  "layout.managerFallback": "Manager",
  "layout.permissions": "Menus",
  "layout.roles": "Roles",
  "layout.systemManagement": "System Management",
  "layout.users": "Users",
  "login.failed": "Login failed",
  "login.password": "Password",
  "login.signIn": "Sign in",
  "login.signingIn": "Signing in",
  "login.title": "Knowledge Manager",
  "login.username": "Username",
  "permissions.activeCount": "{count} active permissions",
  "permissions.componentPath": "TSX path",
  "permissions.failedLoad": "Failed to load permissions",
  "permissions.isMenu": "Menu",
  "permissions.name": "Name",
  "permissions.routePath": "Route path",
  "permissions.saved": "Permission saved",
  "permissions.selectParent": "No parent",
  "permissions.sortOrder": "Sort",
  "permissions.title": "Permissions",
  "roles.activeCount": "{count} active roles",
  "roles.failedLoad": "Failed to load roles",
  "roles.name": "Role",
  "roles.namePlaceholder": "Role name",
  "roles.permissions": "Permissions",
  "roles.permissionsHeading": "{role} permissions",
  "roles.permissionsSaved": "Permissions saved",
  "roles.saved": "Role saved",
  "roles.savePermissions": "Save permissions",
  "roles.title": "Roles",
  "users.activeCount": "{count} active users",
  "users.failedLoad": "Failed to load users",
  "users.failedSave": "Failed to save user",
  "users.newPasswordOptional": "New password optional",
  "users.password": "Password",
  "users.role": "Role",
  "users.saved": "User saved",
  "users.selectRole": "Select role",
  "users.title": "Users",
  "users.username": "Username",
  "users.userDeleted": "User deleted",
};

type TranslationKey = keyof typeof en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = "knowledge_locale";
const DEFAULT_LOCALE: Locale = "en";
const SUPPORTED_LOCALES: Locale[] = ["en", "zh-CN"];

const zh: Record<TranslationKey, string> = {
  "common.actions": "操作",
  "common.cancel": "取消",
  "common.create": "创建",
  "common.delete": "删除",
  "common.description": "描述",
  "common.edit": "编辑",
  "common.id": "ID",
  "common.no": "否",
  "common.noParent": "无上级",
  "common.parent": "上级",
  "common.update": "更新",
  "common.url": "URL",
  "common.yes": "是",
  "dashboard.managerWorkspace": "管理工作台",
  "dashboard.permissionCardDescription": "配置菜单入口和受保护资源。",
  "dashboard.permissionManager": "权限管理",
  "dashboard.roleCardDescription": "维护角色并分配权限菜单。",
  "dashboard.roleManager": "角色管理",
  "dashboard.title": "仪表盘",
  "dashboard.userCardDescription": "管理后台账号和角色归属。",
  "dashboard.userManager": "用户管理",
  "language.english": "English",
  "language.label": "语言",
  "language.chinese": "中文",
  "layout.brand": "知识库管理",
  "layout.dashboard": "仪表盘",
  "layout.logout": "退出登录",
  "layout.managerFallback": "管理员",
  "layout.permissions": "菜单",
  "layout.roles": "角色",
  "layout.systemManagement": "系统管理",
  "layout.users": "用户",
  "login.failed": "登录失败",
  "login.password": "密码",
  "login.signIn": "登录",
  "login.signingIn": "正在登录",
  "login.title": "知识库管理",
  "login.username": "用户名",
  "permissions.activeCount": "{count} 个有效权限",
  "permissions.componentPath": "TSX 地址",
  "permissions.failedLoad": "权限加载失败",
  "permissions.isMenu": "菜单",
  "permissions.name": "名称",
  "permissions.routePath": "路由地址",
  "permissions.saved": "权限已保存",
  "permissions.selectParent": "无上级",
  "permissions.sortOrder": "排序",
  "permissions.title": "权限",
  "roles.activeCount": "{count} 个有效角色",
  "roles.failedLoad": "角色加载失败",
  "roles.name": "角色",
  "roles.namePlaceholder": "角色名称",
  "roles.permissions": "权限",
  "roles.permissionsHeading": "{role} 的权限",
  "roles.permissionsSaved": "权限已保存",
  "roles.saved": "角色已保存",
  "roles.savePermissions": "保存权限",
  "roles.title": "角色",
  "users.activeCount": "{count} 个有效用户",
  "users.failedLoad": "用户加载失败",
  "users.failedSave": "用户保存失败",
  "users.newPasswordOptional": "新密码可选",
  "users.password": "密码",
  "users.role": "角色",
  "users.saved": "用户已保存",
  "users.selectRole": "选择角色",
  "users.title": "用户",
  "users.username": "用户名",
  "users.userDeleted": "用户已删除",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  "zh-CN": zh,
};

const I18nContext = createContext<I18nContextValue | null>(null);

function normalizeLocale(value: string | null): Locale {
  return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

export function formatMessage(message: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((current, [key, value]) => current.split(`{${key}}`).join(String(value)), message);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => normalizeLocale(localStorage.getItem(STORAGE_KEY)));

  function setLocale(nextLocale: Locale) {
    const normalized = normalizeLocale(nextLocale);
    localStorage.setItem(STORAGE_KEY, normalized);
    setLocaleState(normalized);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    function t(key: TranslationKey) {
      return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
    }

    return { locale, setLocale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
