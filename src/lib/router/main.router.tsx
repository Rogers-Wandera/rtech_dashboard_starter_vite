import { createBrowserRouter } from "react-router-dom";
import { AuthRouter } from "./dashboardroutes";
import { NoAuthRouter } from "./noauthrouter";
import { ErrorRoutes } from "./errorroutes";
import { GeneralAuthRoutes } from "./generalauthroutes";
import Providers from "../providers/provider.main";
import App from "@/App";

export const router = createBrowserRouter([
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
]);
