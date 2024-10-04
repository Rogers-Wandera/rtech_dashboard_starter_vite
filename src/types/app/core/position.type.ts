import { BaseTableType } from "@/types/server/server.main.types";

export type Position = BaseTableType & {
  id: number;
  position: string;
};
