import { useSelector } from "react-redux";
import { RootState } from "./lib/store/store";
import { Box, LoadingOverlay, useMantineColorScheme } from "@mantine/core";
import { useAppDispatch } from "./hooks/store.hooks";
import { setSetting } from "./lib/store/settings/dasboardsettings/actions";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useMaterialTheme } from "./lib/themes/material.theme";
import { setShowSubHeader } from "./lib/store/services/defaults/defaults";

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );

  const theme = useMaterialTheme();
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  useEffect(() => {
    dispatch(setSetting());
  }, []);

  useEffect(() => {
    if (theme.palette.mode === "dark") {
      setColorScheme("dark");
    } else {
      setColorScheme("light");
    }
  }, [theme.palette.mode]);

  useEffect(() => {
    dispatch(setShowSubHeader(true));
  }, [location.pathname]);
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <Outlet />
    </Box>
  );
};

export default App;
