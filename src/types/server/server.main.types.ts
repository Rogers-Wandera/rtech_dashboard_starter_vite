import { METHODS } from "../enums/enum.types";

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
};
export type UserModuleRes = {
  [key: string]: ServerModuleRes[];
};

export interface PaginateResponse<T = Record<string, unknown>> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
}

export interface ServerErrorResponse {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string;
  stack: string;
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