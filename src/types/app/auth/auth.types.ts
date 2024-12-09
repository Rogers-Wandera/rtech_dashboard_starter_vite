import { METHODS, ROLES } from "@/types/enums/enum.types";
import {
  IAuthUser,
  ServerResponse,
  UserModuleRes,
} from "../../server/server.main.types";

export interface ILoginValues {
  email: string;
  password: string;
}

export type LoginResponse = ServerResponse & {
  accessToken: string;
};

export type RegisterResponse = ServerResponse & {
  emailsent: string;
};

export type AuthContextState = {
  isLoggedIn: boolean;
  token: string | null;
  user: IAuthUser | null;
  modules: UserModuleRes;
};

export interface TypeToken {
  exp: number;
  iat: number;
  sub: string;
  user: IAuthUser;
}

export interface WithRolesProps {
  roles: ROLES[];
}

export type ResetPasswordValues = {
  confirmpassword: string;
  password: string;
};

export interface Permission {
  id: number;
  moduleLinkId: number;
  accessName: string;
  accessRoute: string;
  method: METHODS;
  description: string;
  creationDate: Date;
  createdBy: string;
  updatedBy: string;
  updateDate: Date;
  deleted_at: Date;
  deletedBy: string;
  isActive: number;
  linkname: string;
  name: string;
  route: string;
  render: string;
}
