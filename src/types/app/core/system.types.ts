import { IBaseTableType } from "@/types/server/server.main.types";
import { Permission } from "../auth/auth.types";

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
