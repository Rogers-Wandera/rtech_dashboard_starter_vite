import { ROLES } from "@/types/enums/enum.types";
import { IAuthUser, UserModuleRes } from "../../server/server.main.types";

export interface ILoginValues {
  email: string;
  password: string;
}
export type LoginResponse = {
  msg: string;
  accessToken: string;
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
