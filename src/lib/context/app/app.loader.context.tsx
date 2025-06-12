import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { RootState } from "@/lib/store/store";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useSelector } from "react-redux";

export type loaderConfigs = {
  loadingText?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};
export interface AppLoaderContextState {
  setLoading: (loading: boolean) => void;
  setLoaderConfigs: Dispatch<SetStateAction<loaderConfigs>>;
  loading: boolean;
  loaderConfigs: loaderConfigs;
}
const AppLoaderContext = createContext<AppLoaderContextState | undefined>(
  undefined
);

const AppLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );

  const [loaderConfigs, setLoaderConfigs] = useState<loaderConfigs>({
    loadingText: "Loading data...",
    color: "tw:text-blue-600",
    size: "md",
    fullScreen: false,
  });

  const setLoad = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  return (
    <AppLoaderContext.Provider
      value={{ setLoading: setLoad, setLoaderConfigs, loading, loaderConfigs }}
    >
      {children}
    </AppLoaderContext.Provider>
  );
};

const useLoader = () => {
  const context = useContext(AppLoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a AppLoaderProvider");
  }
  return context;
};
export { useLoader, AppLoaderProvider };
