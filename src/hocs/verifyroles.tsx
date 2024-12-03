import { useAuth } from "@/hooks/auth.hooks";
import { WithRolesProps } from "@/types/app/auth/auth.types";
import React from "react";
import { Navigate } from "react-router";

const RouteRoles = <P extends WithRolesProps>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const { roles, ...rest } = props as WithRolesProps;
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }
    const results = user?.roles.map((role) => roles.includes(role));
    const checkResults = results.find((result) => result === true);
    if (!checkResults) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...(rest as P)} />;
  };

  return WrapperComponent;
};

export default RouteRoles;
