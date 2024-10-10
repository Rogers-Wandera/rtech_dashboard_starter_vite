import { IPaginate } from "../server/server.main.types";

export interface IPaginateContext<T = Record<string, any>> {
  paginate: IPaginate<T>;
  setPaginate: React.Dispatch<React.SetStateAction<IPaginate<T>>>;
}
