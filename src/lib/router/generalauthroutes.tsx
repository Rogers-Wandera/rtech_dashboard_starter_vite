import ChangePassword from "@/app/views/auth/changepassword/changepassword";
import ProtectedLayout from "@/hocs/protectedlayout";
import { RouteObject } from "react-router-dom";

export const GeneralAuthRoutes: RouteObject = {
  element: <ProtectedLayout />,
  children: [{ path: "/changepword", element: <ChangePassword /> }],
};
