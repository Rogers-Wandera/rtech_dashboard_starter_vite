import { createBrowserRouter } from "react-router";
import { AuthRouter } from "./dashboardroutes";
import { NoAuthRouter } from "./noauth/noauthrouter";
import { ErrorRoutes } from "./error/errorroutes";
import { GeneralAuthRoutes } from "./general/generalauthroutes";
import Providers from "../providers/provider.main";
import App from "@/App";

export const router = createBrowserRouter(
  [
    {
      element: <Providers />,
      children: [
        {
          element: <App />,
          children: [
            ...NoAuthRouter,
            AuthRouter,
            GeneralAuthRoutes,
            ...ErrorRoutes,
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
