import { AppContextState } from "@/types/app/app.types";
import { AppActions, AppReducerActions } from "./app.actions";
import { InitialAppState } from "./app.state";

const AppReducer = (
  setValue: (
    val: AppContextState | ((prevState: AppContextState) => AppContextState)
  ) => void
) => {
  return (state: AppContextState, action: AppReducerActions) => {
    let newState = state;
    switch (action.type) {
      case AppActions.PAGE_STATE:
        newState = {
          ...state,
          page: { ...state.page, pageState: action.payload },
        };
        break;
      case AppActions.RESET_STATE:
        newState = action.payload
          ? { ...action.payload }
          : { ...InitialAppState };
        break;
      default:
        newState = state;
    }
    setValue(newState);
    return newState;
  };
};

export default AppReducer;
