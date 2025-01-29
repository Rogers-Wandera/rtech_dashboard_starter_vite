import { Fragment, useEffect } from "react";
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
import { Alert, LoadingOverlay } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router";
import WithAuth from "@/hocs/auth/auth.hoc";
import WithRouteRole from "@/hocs/auth/routerole.hoc";
import WithSession from "@/hocs/auth/session.hoc";
import WithUserModules from "@/hocs/auth/withmodules.hoc";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setNextRoute } from "@/lib/store/services/defaults/defaults";
import { useSocket } from "@/lib/context/services/socket";
import { IconInfoCircle } from "@tabler/icons-react";
import { withNotification } from "@/hocs/services/notifications/notification.hoc";
import { withUserService } from "@/hocs/services/auth/userservice.hoc";

type props = { userstate?: { online: string[] } };

function DashboardLayout({ userstate }: props) {
  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );
  const state = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const showSubHeader = useSelector(
    (state: RootState) => state.appState.defaultstate.showSubHeader
  );
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
  return (
    <Fragment>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <Sidebar app_name={appName} />
      <main className="main-content">
        <div className="position-relative">
          {state?.error && (
            <Alert
              variant="light"
              color="red"
              title={`Server connection error: ${state?.error}`}
              icon={<IconInfoCircle />}
            />
          )}
          {!state?.error && <Header />}
          <SubHeader />
        </div>
        <div
          className={`py-0 conatiner-fluid content-inner mt-${
            showSubHeader ? "n5" : "4"
          }`}
        >
          <Outlet context={{ online: userstate?.online || [] }} />
        </div>
        <div className="btn-download">
          <Button variant="success py-1 px-1 d-flex gap-0">
            <SupportAgentIcon />
          </Button>
        </div>
        <Footer app_name={appName} />
      </main>
      <SettingOffCanvas />
    </Fragment>
  );
}

const DashBoardWithSession = WithAuth(
  withUserService(withNotification(WithSession(DashboardLayout)))
);
const DashboardWithModules = WithUserModules(DashBoardWithSession);
const DashboardWithRoles = WithRouteRole(DashboardWithModules);
export default DashboardWithRoles;
