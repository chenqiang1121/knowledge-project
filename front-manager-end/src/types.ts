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

export interface User {
  id?: number;
  username: string;
  password?: string;
  roleId?: number;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface Role {
  id?: number;
  roleName: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface Permission {
  id?: number;
  name: string;
  url?: string;
  parentId?: number;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
