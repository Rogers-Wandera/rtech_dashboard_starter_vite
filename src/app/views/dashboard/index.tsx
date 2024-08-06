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
import { useGetUserModulesQuery } from "@/lib/store/services/auth/auth.api";
import { LoadingOverlay } from "@mantine/core";
import { Outlet } from "react-router-dom";
import WithAuth from "@/hocs/auth.hoc";
import { useAuth } from "@/hooks/auth.hooks";
import WithRouteRole from "@/hocs/routerole.hoc";
import WithSession from "@/hocs/session.hoc";

function DashboardLayout() {
  const { isLoggedIn, user } = useAuth();
  const loading = useSelector(
    (state: RootState) => state.appState.defaultstate.isLoading
  );
  const { refetch } = useGetUserModulesQuery(String(user?.id), {
    skip: !isLoggedIn,
  });
  const appName = useSelector(SettingSelector.app_name);
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn]);
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
          <Header />
          <SubHeader />
        </div>
        <div className="py-0 conatiner-fluid content-inner mt-n5">
          <Outlet />
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

export default WithAuth(WithRouteRole(WithSession(DashboardLayout)));
