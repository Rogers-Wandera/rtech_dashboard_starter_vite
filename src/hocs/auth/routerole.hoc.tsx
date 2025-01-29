import { urlexcludes } from "@/assets/app/urlexcludes";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { RootState } from "@/lib/store/store";
import { UserModuleRes } from "@/types/server/server.main.types";
import { useSelector } from "react-redux";
import { matchPath, Navigate, useLocation } from "react-router";

const hasRouteRole = (modules: UserModuleRes, pathname: string): boolean => {
  if (urlexcludes.includes(pathname)) {
    return true;
  } else {
    for (const moduleLinks of Object.values(modules)) {
      if (
        moduleLinks.some((link) => {
          const match = matchPath(link.route, pathname);
          return match && link.expired !== 1;
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
    const loading = useSelector(
      (state: RootState) => state.appState.defaultstate.isLoading
    );
    const location = useLocation();
    const { modules } = useAuth();
    const path = location.pathname;
    if (!loading && !modules && !urlexcludes.includes(path)) {
      return <Navigate to="/unauthorized" />;
    }
    if (!hasRouteRole(modules, path)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...props} />;
  };
}

export default WithRouteRole;
