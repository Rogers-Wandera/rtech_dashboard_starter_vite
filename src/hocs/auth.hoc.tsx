import { useAuth } from "@/hooks/auth.hooks";
import React from "react";
import { Navigate } from "react-router-dom";

function WithAuth<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WithAuth(props) {
    const { isLoggedIn, token, user } = useAuth();

    if (!isLoggedIn && !token && token !== "") {
      return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }

    if (isLoggedIn && user && user.adminCreated === 1) {
      return <Navigate to="/changepword" replace />;
    }
    return <Component {...props} />;
  };
}

export default WithAuth;
