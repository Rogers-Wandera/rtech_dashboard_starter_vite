import { USER_GROUP_STATUS } from "@/types/enums/enum.types";
import {
  IBaseTableType,
  SystemRole,
  UserSystemRole,
} from "@/types/server/server.main.types";
import { ModuleLinkType } from "./system.types";
import { Permission } from "../auth/auth.types";

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  tel: string;
  verified: number;
  creationDate: Date;
  lastloginDate: Date;
  isLocked: number;
  isActive: number;
  deleted_at: Date;
  adminCreated: number;
  position: string;
  positionId: number | string;
  gender: string;
  userName: string;
  image: string;
  online: string;
  last_active: number;
};

export type UserSingleView = User & {
  system_roles: {
    roles: UserSystemRole[];
    unassigned: SystemRole[];
  };
};

export interface UserGroupMember extends IBaseTableType {
  id: number;
  group?: UserGroup;
  user?: User;
  userId?: string;
  userName?: string;
  userImage?: string | null;
  groupName?: string;
  gender?: string;
}

export interface UserGroupSupervisors extends IBaseTableType {
  id: number;
  user?: User;
  group?: UserGroup;
  userName?: string;
  userImage?: string | null;
  userId?: string;
  groupName?: string;
  gender?: string;
  isMain: number;
}

export interface LinkRole extends IBaseTableType {
  id: number;
  ModuleLink: ModuleLinkType;
  User: User;
  expireDate: string;
  rolepermissions: Permission[];
  group: UserGroup;
}

export interface UserGroup extends IBaseTableType {
  id: number;
  groupName: string;
  status: USER_GROUP_STATUS;
  description: string;
  members: UserGroupMember[];
  supervisor: UserGroupSupervisors[];
  roles: LinkRole[];
}
