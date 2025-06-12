import { Fragment, useEffect, useState } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingOffCanvas from "@/components/settings/SettingOffCanvas";
import Footer from "@/components/partials/FooterStyle/footer";
import { useSelector } from "react-redux";
import * as SettingSelector from "@/lib/store/settings/dasboardsettings/selectors";
import Header from "@/components/partials/HeaderStyle/header";
import { Button } from "react-bootstrap";
import SubHeader from "@/components/partials/HeaderStyle/sub-header";
import Sidebar from "@/components/partials/SidebarStyle/sidebar";
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
import { AnimatePresence } from "framer-motion";
import CustomLoader from "@/app/components/loaders/loading";
import { useLoader } from "@/lib/context/app/app.loader.context";

type props = { userstate?: { online: string[] } };

function DashboardLayout({ userstate }: props) {
  const upload = useSelector(
    (state: RootState) => state.appState.authuser.upload
  );
  // const state = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const showSubHeader = useSelector(
    (state: RootState) => state.appState.defaultstate.showSubHeader
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const dispatch = useAppDispatch();
  const appName = useSelector(SettingSelector.app_name);
  const nextroute = useSelector(
    (state: RootState) => state.appState.defaultstate.nextRoute
  );

  const HandleNextRoute = () => {
    if (nextroute && nextroute !== location.pathname) {
      navigate(nextroute, { replace: true });
    }
  };

  useEffect(() => {
    HandleNextRoute();
    dispatch(setNextRoute(null));
  }, [nextroute]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fragment>
      <AnimatePresence>
        {isInitialLoad && (
          <CustomLoader
            size="lg"
            color="tw:text-indigo-600"
            text="Preparing your dashboard..."
          />
        )}
      </AnimatePresence>
      {!isInitialLoad && (
        <>
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
        </>
      )}
    </Fragment>
  );
}

const DashBoardWithSession = WithAuth(
  withUserService(WithSession(DashboardLayout))
);
const DashboardWithModules = WithUserModules(DashBoardWithSession);
const DashboardWithRoles = WithRouteRole(DashboardWithModules);
export default DashboardWithRoles;
