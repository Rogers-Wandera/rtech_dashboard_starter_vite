import { useAuth } from "@/hooks/auth.hooks";
import { Outlet, Navigate, useLocation } from "react-router";

const ProtectedLayout = () => {
  const { token, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!token && !isLoggedIn && token !== "") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedLayout;
