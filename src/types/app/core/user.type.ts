import { SystemRole, UserSystemRole } from "@/types/server/server.main.types";

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
