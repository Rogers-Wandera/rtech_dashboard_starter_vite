import { useSelector } from "react-redux";
import { RootState } from "./lib/store/store";
import { LoadingOverlay } from "@mantine/core";
import { useAppDispatch } from "./hooks/store.hooks";
import { setSetting } from "./lib/store/settings/dasboardsettings/actions";

const App = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );
  dispatch(setSetting());
  return (
    <div>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      {children}
    </div>
  );
};

export default App;
