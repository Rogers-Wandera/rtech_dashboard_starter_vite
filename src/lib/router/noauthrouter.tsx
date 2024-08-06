import ChangePassword from "@/app/views/auth/changepassword/changepassword";
import AuthLogin from "@/app/views/auth/login/login";
import { RouteObject } from "react-router-dom";

export const NoAuthRouter: RouteObject[] = [
  {
    path: "/",
    element: <AuthLogin />,
  },
  {
    path: "/changepword",
    element: <ChangePassword />,
  },
];
