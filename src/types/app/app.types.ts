import { IPaginate } from "../server/server.main.types";

export interface IPaginateContext<T = Record<string, any>> {
  paginate: IPaginate<T>;
  setPaginate: React.Dispatch<React.SetStateAction<IPaginate<T>>>;
}

export type MantineSelectType<T extends Record<string, any>> = {
  value: string;
  label: T[string | keyof T];
};