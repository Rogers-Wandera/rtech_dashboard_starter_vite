import {
  Fragment,
  Suspense,
  useEffect,
  lazy,
  useState,
  useCallback,
} from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingOffCanvas from "@/components/settings/SettingOffCanvas";
import Footer from "@/components/partials/FooterStyle/footer";
import { useSelector } from "react-redux";
import * as SettingSelector from "@/lib/store/settings/dasboardsettings/selectors";
import { Button } from "react-bootstrap";
import { RootState } from "@/lib/store/store";
import { Box } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router";
import WithAuth from "@/hocs/auth/auth.hoc";
import WithRouteRole from "@/hocs/auth/routerole.hoc";
import WithSession from "@/hocs/auth/session.hoc";
import WithUserModules from "@/hocs/auth/withmodules.hoc";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setNextRoute } from "@/lib/store/services/defaults/defaults";
import { withUserService } from "@/hocs/services/auth/userservice.hoc";
import UploadProgressShow from "@/components/settings/uploadprogress";
import { SessionTimer } from "@/components/shared/session/session";
import SocketConnectionNotifier from "@/app/components/connection/server.connection";
import CustomLoader from "@/app/components/loaders/loading";

const SubHeader = lazy(
  () => import("@/components/partials/HeaderStyle/sub-header")
);
const Sidebar = lazy(
  () => import("@/components/partials/SidebarStyle/sidebar")
);
const Header = lazy(() => import("@/components/partials/HeaderStyle/header"));

type Props = { userstate?: { online: string[] } };

function DashboardLayout({ userstate }: Props) {
  const upload = useSelector(
    (state: RootState) => state.appState.authuser.upload
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const showSubHeader = useSelector(
    (state: RootState) => state.appState.defaultstate.showSubHeader
  );
  const dispatch = useAppDispatch();
  const appName = useSelector(SettingSelector.app_name);
  const nextroute = useSelector(
    (state: RootState) => state.appState.defaultstate.nextRoute
  );

  const handleNextRoute = useCallback(() => {
    if (nextroute && nextroute !== location.pathname) {
      navigate(nextroute, { replace: true });
      dispatch(setNextRoute(null));
    }
  }, [nextroute, location.pathname, navigate, dispatch]);

  useEffect(() => {
    handleNextRoute();
  }, [handleNextRoute]);

  // Minimum loading time to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      {isLoading && (
        <CustomLoader
          visible={true}
          progress={true}
          message="Loading dashboard..."
          loaderVariant="dots"
          loaderColor="teal"
          progressInterval={80}
        />
      )}

      <div style={{ visibility: isLoading ? "hidden" : "visible" }}>
        <Suspense
          fallback={
            <CustomLoader
              visible={true}
              progress={true}
              message="Loading dashboard..."
              loaderVariant="dots"
              loaderColor="teal"
              progressInterval={80}
            />
          }
        >
          <Sidebar app_name={appName} />
          <main className="main-content">
            <div className="position-relative">
              <Header />
              <SubHeader />
            </div>
            <div
              className={`py-0 conatiner-fluid content-inner mt-${
                showSubHeader ? "n5" : "4"
              }`}
            >
              <Outlet context={{ online: userstate?.online || [] }} />
              <SessionTimer />
              <SocketConnectionNotifier />
            </div>
            <div className="btn-download">
              <Button variant="success py-1 px-1 d-flex gap-0">
                <SupportAgentIcon />
              </Button>
            </div>
            <Footer app_name={appName} />
          </main>
          <SettingOffCanvas />
          {upload?.progress && upload.progress.length > 0 && (
            <div className="btn-download" style={{ top: 10 }}>
              <Box className="py-1 px-1 d-flex gap-0">
                <UploadProgressShow />
              </Box>
            </div>
          )}
        </Suspense>
      </div>
    </Fragment>
  );
}
const DashBoardWithSession = WithAuth(
  withUserService(WithSession(DashboardLayout))
);
const DashboardWithModules = WithUserModules(DashBoardWithSession);
const DashboardWithRoles = WithRouteRole(DashboardWithModules);

export default DashboardWithRoles;
