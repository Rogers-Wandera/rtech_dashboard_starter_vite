import { useSelector } from "react-redux";
import { RootState } from "./lib/store/store";
import { Box, LoadingOverlay, useMantineColorScheme } from "@mantine/core";
import { useAppDispatch } from "./hooks/store.hooks";
import { setSetting } from "./lib/store/settings/dasboardsettings/actions";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useMaterialTheme } from "./lib/themes/material.theme";
import { setShowSubHeader } from "./lib/store/services/defaults/defaults";
import ErrorBoundary from "./lib/utils/errorhandler/error.boundary";
import { useLoader } from "./lib/context/app/app.loader.context";
import CustomLoader from "./app/components/loaders/loading";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { loaderConfigs, loading } = useLoader();

  const theme = useMaterialTheme();
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === null) {
      // localStorage has been cleared
      window.location.reload(); // or any other action
    }
  };

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

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Box pos="relative">
      <ErrorBoundary>
        {/* <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "blue", type: "bars" }}
        /> */}
        <AnimatePresence>
          {loading && (
            <div className="tw:absolute tw:inset-0 tw:z-50 tw:backdrop-blur-sm tw:bg-white/80 tw:flex tw:items-center tw:justify-center">
              <CustomLoader
                size={loaderConfigs.size}
                color={loaderConfigs.color}
                text={loaderConfigs.loadingText}
                fullScreen={loaderConfigs.fullScreen}
              />
            </div>
          )}
        </AnimatePresence>
        <Outlet />
      </ErrorBoundary>
    </Box>
  );
};

export default App;
