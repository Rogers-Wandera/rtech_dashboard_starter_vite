import { useAuth } from "@/hooks/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import { HelperClass } from "@/lib/utils/helpers/helper";
import { notifier } from "@/lib/utils/notify/notification";
import { useInterval } from "@mantine/hooks";
import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

function WithSession<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const helper = new HelperClass();
  return function Session(props) {
    const dispatch = useAppDispatch();
    const { isLoggedIn, token } = useAuth();
    const location = useLocation();

    const LogUserOut = useCallback(() => {
      if (helper.isTokenExpired(token) && isLoggedIn) {
        dispatch(setSession(false));
        dispatch(logOut());
        notifier.success({
          message: "Your session has expired, please login",
          title: "Session Expired",
        });
      }
    }, [dispatch, token, isLoggedIn]);

    const CheckSession = useCallback(() => {
      if (helper.isTokenToExpire(token) && isLoggedIn) {
        if (helper.isTokenExpired(token)) {
          LogUserOut();
        } else {
          dispatch(setSession(true));
          notifier.info({
            message:
              "Your session is about to expire. Please update the session.",
          });
        }
      }
    }, [dispatch, token, isLoggedIn, LogUserOut]);
    // 300000

    const interval = useInterval(CheckSession, 60000, { autoInvoke: true });
    useEffect(() => {
      interval.start();
      return () => interval.stop();
    }, []);

    useEffect(() => {
      LogUserOut();
    }, [location.pathname, LogUserOut]);

    return <Component {...props} />;
  };
}

export default WithSession;
