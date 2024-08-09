import ForgotPassword from "@/app/views/auth/forgotpassword/forgot";
import AuthLogin from "@/app/views/auth/login/login";
import ResetPassword from "@/app/views/auth/resetpassword/reset";
import VerifyAccount from "@/app/views/auth/verifyaccount/verify";
import { RouteObject } from "react-router-dom";

export const NoAuthRouter: RouteObject[] = [
  {
    path: "/",
    element: <AuthLogin />,
  },
  {
    path: "/pwreset",
    element: <ForgotPassword />,
  },
  {
    path: "/resetpassword/:userId/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verifyaccount/:userId/:token",
    element: <VerifyAccount />,
  },
];
