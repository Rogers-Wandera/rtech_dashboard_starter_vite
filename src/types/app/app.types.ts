import { AppReducerActions } from "@/lib/reducers/app/app.actions";
import { IPaginate, ServerErrorResponse } from "../server/server.main.types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export interface IPaginateContext<T = Record<string, any>> {
  paginate: IPaginate<T>;
  setPaginate: React.Dispatch<React.SetStateAction<IPaginate<T>>>;
}

export type MantineSelectType<T extends Record<string, any>> = {
  value: string;
  label: string | NonNullable<T[keyof T]>;
};

export interface AppContextState {
  page: {
    pageState: Record<string, any>;
  };
}

export interface AppDefaultContext {
  dispatch: React.Dispatch<AppReducerActions>;
  state: AppContextState;
}

export type TanStackRefetchType<T = Record<string, any>> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<T, ServerErrorResponse>>;
