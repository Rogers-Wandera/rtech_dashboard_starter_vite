import { createBrowserRouter } from "react-router-dom";
import { AuthRouter } from "./dashboardroutes";
import { NoAuthRouter } from "./noauthrouter";
import { ErrorRoutes } from "./errorroutes";
import { GeneralAuthRoutes } from "./generalauthroutes";

export const router = createBrowserRouter([
  ...NoAuthRouter,
  AuthRouter,
  GeneralAuthRoutes,
  ...ErrorRoutes,
]);
