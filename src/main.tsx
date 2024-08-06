import React from "react";
import ReactDOM from "react-dom/client";

import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/notifications/styles.css";

import "@/assets/scss/hope-ui.scss";
import "@/assets/scss/custom.scss";
import "@/assets/scss/dark.scss";
import "@/assets/scss/rtl.scss";
import "@/assets/scss/customizer.scss";

import App from "./App.tsx";
import Providers from "./lib/providers/provider.main.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router/main.router.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App>
        <RouterProvider router={router} />
      </App>
    </Providers>
  </React.StrictMode>
);
