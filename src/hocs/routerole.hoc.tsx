import { useAuth } from "@/hooks/auth.hooks";
import { UserModuleRes } from "@/types/server/server.main.types";
import { Navigate } from "react-router-dom";

const urlexcludes: string[] = ["/dashboard"];

const hasRouteRole = (modules: UserModuleRes, pathname: string): boolean => {
  if (urlexcludes.includes(pathname)) {
    return true;
  } else {
    for (const moduleLinks of Object.values(modules)) {
      if (
        moduleLinks.some((link) => {
          return `${link.route}` === pathname && link.expired !== 1;
        })
      ) {
        return true;
      }
    }
    return false;
  }
};
function WithRouteRole<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function RouteRole(props) {
    const { modules } = useAuth();
    const path = location.pathname;
    if (!modules && !urlexcludes.includes(path)) {
      return <Navigate to="/unauthorized" replace />;
    }
    if (!hasRouteRole(modules, path)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return <Component {...props} />;
  };
}

export default WithRouteRole;
