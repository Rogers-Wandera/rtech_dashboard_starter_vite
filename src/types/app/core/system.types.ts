import { IBaseTableType } from "@/types/server/server.main.types";
import { Permission } from "../auth/auth.types";
import { METHODS } from "@/types/enums/enum.types";

export interface ModuleType extends IBaseTableType {
  id: number;
  name: string;
  position: number;
  icon: string;
}

export interface ModuleLinkType extends IBaseTableType {
  id: number;
  moduleId: number;
  linkname: string;
  route: string;
  position: number;
  released: number;
  render: number;
  name: string;
  mpos: number;
  icon: string;
  permissions: Permission[];
}

export interface ServerLinkRole {
  id: number;
  linkname: string;
  route: string;
  position: number;
  render: number;
  released: number;
  moduleId: number;
  name: string;
  mpos: number;
  icon: string;
  linkRoleId: number | null;
  userName: string | null;
  is_assigned: number;
  expireDate: string | null;
  expired: number | null;
  days_left: number | null;
  userId: string;
  permissions: ServerLinkPermission[];
  groupId: number | null;
}

export interface ServerLinkPermission {
  id: number;
  accessName: string;
  accessRoute: string;
  method: METHODS;
  description: string;
  moduleLinkId: number;
  linkname: string;
  name: string;
  route: string;
  render: number;
  roleId: null | number;
  rpId: null | number;
  userId: null | string;
  checked: number;
  groupId: number;
  groupName: null | string;
  memberId: null | number;
  userName: null | string;
  permissionType: "user" | "group";
  creationDate: Date;
  createdBy: string;
  updatedBy: string;
  updateDate: Date;
  deleted_at: Date;
  deletedBy: string;
  isActive: number;
}
