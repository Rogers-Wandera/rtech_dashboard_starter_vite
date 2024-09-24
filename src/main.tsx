import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/notifications/styles.css";

import "@/assets/scss/hope-ui.scss";
import "@/assets/scss/custom.scss";
import "@/assets/scss/dark.scss";
import "@/assets/scss/rtl.scss";
import "@/assets/scss/customizer.scss";

import "./index.css";

import App from "./App.tsx";
import Providers from "./lib/providers/provider.main";
import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router/main.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./lib/store/store.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Providers>
          <App>
            <RouterProvider router={router} />
          </App>
        </Providers>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
