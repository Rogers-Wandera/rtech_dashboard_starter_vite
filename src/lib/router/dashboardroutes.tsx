import DashboardLayout from "@/app/views/dashboard";
import ManageUsers from "@/app/views/dashboard/core/auth/users/users";
import ManagePositions from "@/app/views/dashboard/core/system/positions/positions";
import Dashboard from "@/app/views/dashboard/dashboard/dashboard";
import { ROLES } from "@/types/enums/enum.types";
import { RouteObject } from "react-router-dom";

export const AuthRouter: RouteObject = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
    {
      path: "/dashboard/core/auth/user",
      element: <ManageUsers roles={[ROLES.ADMIN]} />,
    },
    { path: "/dashboard/core/system/positions", element: <ManagePositions /> },
  ],
};
