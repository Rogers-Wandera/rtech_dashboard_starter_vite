import DashboardLayout from "@/app/views/dashboard";
import UserProfile from "@/app/views/dashboard/core/auth/users/userprofile";
import ManageUsers from "@/app/views/dashboard/core/auth/users/users";
import ManagePositions from "@/app/views/dashboard/core/system/positions/positions";
import Dashboard from "@/app/views/dashboard/dashboard/dashboard";
import Modules from "@/app/views/dashboard/core/system/modules/modules";
import { ROLES } from "@/types/enums/enum.types";
import { RouteObject } from "react-router";
import ModuleLinks from "@/app/views/dashboard/core/system/modulelinks/modulelinks";
import UserGroups from "@/app/views/dashboard/core/auth/usergroups/usergroups";
import ManageUserGroups from "@/app/views/dashboard/core/auth/usergroups/manage/manage";

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
    {
      path: "/dashboard/core/auth/user/:id",
      element: <UserProfile />,
    },
    {
      path: "/dashboard/core/system/modules",
      element: <Modules roles={[ROLES.PROGRAMMER]} />,
    },
    {
      path: "/dashboard/core/system/modulelinks/:id",
      element: <ModuleLinks roles={[ROLES.PROGRAMMER]} />,
    },
    {
      path: "/dashboard/core/auth/usergroups",
      element: <UserGroups roles={[ROLES.ADMIN]} />,
    },
    {
      path: "/dashboard/core/auth/usergroups/:groupId",
      element: <ManageUserGroups roles={[ROLES.ADMIN]} />,
    },
  ],
};
