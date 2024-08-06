import { useAuth } from "@/hooks/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import { HelperClass } from "@/lib/utils/helpers/helper";
import { notifier } from "@/lib/utils/notify/notification";
import { useInterval } from "@mantine/hooks";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function WithSession<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function Session(props) {
    const helper = new HelperClass();
    const dispatch = useAppDispatch();
    const { isLoggedIn, token } = useAuth();
    const location = useLocation();

    const LogUserOut = () => {
      if (helper.isTokenExpired(token) && isLoggedIn) {
        dispatch(setSession(false));
        dispatch(logOut());
        notifier.success({
          message: "Your session has expired please login",
          title: "Session Expired",
        });
      }
    };
    const CheckSession = () => {
      if (helper.isTokenToExpire(token) && isLoggedIn) {
        if (helper.isTokenExpired(token)) {
          LogUserOut();
        } else {
          dispatch(setSession(true));
          notifier.info({
            message:
              "Your Session is about to Expired. Please update the session.",
          });
        }
      }
    };
    // 300000

    const interval = useInterval(CheckSession, 60000, { autoInvoke: true });
    useEffect(() => {
      interval.start();
      return interval.stop();
    }, []);

    useEffect(() => {
      LogUserOut();
    }, [location.pathname]);

    return <Component {...props} />;
  };
}

export default WithSession;
