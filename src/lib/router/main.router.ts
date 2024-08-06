import { createBrowserRouter } from "react-router-dom";
import { AuthRouter } from "./authrouter";
import { NoAuthRouter } from "./noauthrouter";
import { ErrorRoutes } from "./errorroutes";

export const router = createBrowserRouter([
  ...NoAuthRouter,
  AuthRouter,
  ...ErrorRoutes,
]);
