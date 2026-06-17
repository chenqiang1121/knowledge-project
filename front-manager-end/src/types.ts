export interface ApiResult<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface SysUser {
  id?: number;
  username: string;
  password?: string;
  sysRoleId?: number;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface SysRole {
  id?: number;
  roleName: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface SysMenu {
  id?: number;
  name: string;
  url?: string;
  parentId?: number | null;
  isMenu?: boolean;
  menuType?: "DIR" | "MENU" | "BUTTON";
  sortOrder?: number;
  routePath?: string;
  componentPath?: string;
  permissionCode?: string;
  icon?: string;
  visible?: boolean;
  refresh?: boolean;
  openType?: "TAB" | "CURRENT" | "NEW_WINDOW" | "";
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
  children?: SysMenu[];
}

export interface LoginResponse {
  token: string;
  user: SysUser;
}
