import { AppContextState } from "@/types/app/app.types";

export enum AppActions {
  RESET_STATE = "RESET_STATE",
  PAGE_STATE = "PAGE_STATE",
}

export type AppReducerActions =
  | {
      type: AppActions.PAGE_STATE;
      payload: Record<string, any>;
    }
  | {
      type: AppActions.RESET_STATE;
      payload?: AppContextState;
    };
