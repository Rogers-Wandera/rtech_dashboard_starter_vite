import { AppActions } from "@/lib/reducers/app/app.actions";
import AppReducer from "@/lib/reducers/app/app.reducer";
import { InitialAppState } from "@/lib/reducers/app/app.state";
import { helpers } from "@/lib/utils/helpers/helper";
import { AppDefaultContext, AppContextState } from "@/types/app/app.types";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, useEffect, useReducer } from "react";

const AppContext = createContext<AppDefaultContext | undefined>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useLocalStorage<AppContextState>({
    key: "app_ctx_state",
    defaultValue: InitialAppState,
    serialize: (value) => {
      if (value) {
        return helpers.encrypt(JSON.stringify(value));
      }
      return helpers.encrypt(JSON.stringify(InitialAppState));
    },
    deserialize: (value) => {
      if (value) {
        return JSON.parse(helpers.decrypt(value));
      }
      return JSON.parse(helpers.decrypt(String(value)));
    },
  });
  const Reducer = AppReducer(setValue);

  const [state, dispatch] = useReducer(Reducer, InitialAppState, () => {
    return value || InitialAppState;
  });

  useEffect(() => {
    if (value && JSON.stringify(state) !== JSON.stringify(value)) {
      dispatch({ type: AppActions.RESET_STATE, payload: value });
    }
  }, [state, value]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};
