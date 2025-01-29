import ChangePassword from "@/app/views/auth/changepassword/changepassword";
import ProtectedLayout from "@/hocs/auth/protectedlayout";
import { RouteObject } from "react-router";

export const GeneralAuthRoutes: RouteObject = {
  element: <ProtectedLayout />,
  children: [{ path: "/changepword", element: <ChangePassword /> }],
};
