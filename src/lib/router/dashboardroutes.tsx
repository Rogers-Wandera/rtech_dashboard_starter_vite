import DashboardLayout from "@/app/views/dashboard";
import { RouteObject } from "react-router";
import { AuthRoutes } from "./core/authroutes/auth.routes";
import { SystemRoutes } from "./core/systemroutes/system.route";
import Dashboard from "@/app/views/dashboard/dashboard/dashboard";
import NotificationPage from "@/app/views/notifications";

export const AuthRouter: RouteObject = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
    AuthRoutes,
    SystemRoutes,
    { path: "/dashboard/core/notifications", element: <NotificationPage /> },
  ],
};
