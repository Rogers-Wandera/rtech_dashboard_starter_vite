import * as Icons from "@tabler/icons-react";
import { METHODS, ROLES } from "../enums/enum.types";

export type ServerRolesType = {
  roleName: string;
  roleValue: string;
  userId: string;
  expired: number;
  days_left: number;
  method: METHODS;
};

export type ServerModuleRes = {
  name: string;
  linkname: string;
  route: string;
  expired: number;
  render: number;
  icon: keyof typeof Icons;
};
export type UserModuleRes = {
  [key: string]: ServerModuleRes[];
};

export interface PaginateResponse<T = Record<string, unknown>> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginate<T = Record<string, any>> {
  limit: number;
  page: number;
  sortBy?: { id: keyof T; desc?: boolean }[];
  conditions?: Partial<T> | null;
  filters?: { id: keyof T; value: string }[];
  globalFilter?: string | null;
}

export interface ServerErrorResponse {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  stack: string;
  error?: string;
}

export interface IAuthUser {
  displayName: string;
  roles: number[];
  id: string;
  isLocked: number;
  verified: number;
  adminCreated: number;
  position: string;
  image: string;
  serverroles: ServerRolesType[];
}

export interface IAuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: IAuthUser | null;
  modules: UserModuleRes;
}

type fetchType<T = any> = {
  type: "GET";
  data: T;
  msg?: string;
};

type NoFetchType<T = any> = {
  type: "POST" | "PATCH" | "PUT" | "DELETE";
  data?: T;
  msg: string;
};
export type ServerResponse<T = any> = fetchType<T> | NoFetchType<T>;

export type BaseTableType = {
  creationDate: Date;
  createdBy: string;
  updateDate: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
  isActive: number;
};

export interface IBaseTableType {
  creationDate: Date;
  createdBy: string;
  updateDate: Date;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
  isActive: number;
}

export interface UserSystemRole {
  id: number;
  userId: string;
  roleId: number;
  isActive: number;
  role: number;
  rolename: string;
  description: string;
  released: number;
}

export type SystemRole = BaseTableType & {
  id: number;
  rolename: string;
  value: ROLES;
  released: number;
  description: string;
};
