import UserGroups from "@/app/views/dashboard/core/auth/usergroups/usergroups";
import ManageUserGroups from "@/app/views/dashboard/core/auth/usergroups/manage/manage";
import RolesPage from "@/app/views/dashboard/core/auth/roles/roles.auth";
import ManageUsers from "@/app/views/dashboard/core/auth/users/users";
import { ROLES } from "@/types/enums/enum.types";
import { RouteObject } from "react-router";
import UserProfilePage from "@/app/views/dashboard/core/auth/users/userprofile";

export const AuthRoutes: RouteObject = {
  path: "/dashboard/core/auth",
  children: [
    {
      path: "user",
      element: <ManageUsers roles={[ROLES.ADMIN]} />,
    },
    {
      path: "user/:id",
      element: <UserProfilePage />,
    },
    {
      path: "usergroups",
      element: <UserGroups roles={[ROLES.ADMIN]} />,
    },
    {
      path: "usergroups/:groupId",
      element: <ManageUserGroups roles={[ROLES.ADMIN]} />,
    },
    {
      path: "roles",
      element: <RolesPage roles={[ROLES.PROGRAMMER]} />,
    },
  ],
};
