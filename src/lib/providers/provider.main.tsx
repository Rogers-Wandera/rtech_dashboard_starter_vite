import { persistor } from "@/lib/store/store";
import { Loader, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "../context/auth/auth.context";
import MRT_TableContextProvider from "../context/table/mrttable.context";
import { useMaterialTheme } from "../themes/material.theme";
import { ThemeProvider } from "@mui/material";
import { ModalsProvider } from "@mantine/modals";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Outlet } from "react-router";
import PaginateProvider from "../context/paginate/paginate.context";
import { MantineTheme } from "../themes/mantine.theme";
import AppContextProvider from "../context/app/app.context";

const Providers = () => {
  const MaterialTheme = useMaterialTheme();
  const Mantine_Theme = MantineTheme();
  return (
    <>
      <ThemeProvider theme={MaterialTheme}>
        <MantineProvider theme={Mantine_Theme}>
          <Suspense
            fallback={
              <div className="centered-loader">
                <Loader type="bars" color="blue" />
              </div>
            }
          >
            <PersistGate
              persistor={persistor}
              loading={
                <div className="centered-loader">
                  <Loader type="bars" color="blue" />
                </div>
              }
            >
              <Notifications
                position="top-right"
                zIndex={1000}
                limit={5}
                autoClose={4000}
              />
              <AuthProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <ModalsProvider>
                    <PaginateProvider>
                      <MRT_TableContextProvider>
                        <AppContextProvider>
                          <Outlet />
                        </AppContextProvider>
                      </MRT_TableContextProvider>
                    </PaginateProvider>
                  </ModalsProvider>
                </LocalizationProvider>
              </AuthProvider>
            </PersistGate>
          </Suspense>
        </MantineProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
