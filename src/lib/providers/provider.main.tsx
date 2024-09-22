import { persistor, store } from "@/lib/store/store";
import { Loader, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "../context/auth/auth.context";
import MRT_TableContextProvider from "../context/table/mrttable.context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MantineProvider>
        <Suspense
          fallback={
            <div className="centered-loader">
              <Loader type="bars" color="blue" />
            </div>
          }
        >
          <Provider store={store}>
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
                <MRT_TableContextProvider>{children}</MRT_TableContextProvider>
              </AuthProvider>
            </PersistGate>
          </Provider>
        </Suspense>
      </MantineProvider>
    </>
  );
};

export default Providers;
