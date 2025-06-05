import { useAuth } from "@/hooks/auth/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useNotification } from "@/lib/context/notifications/notification";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { stopTimer, tick } from "@/lib/store/services/auth/session.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import { RootState } from "@/lib/store/store";
import { notifier } from "@/lib/utils/notify/notification";
import { useInterval } from "@mantine/hooks";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function WithSession<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function Session(props) {
    const dispatch = useAppDispatch();
    const warnedRef = useRef(false);
    const { isLoggedIn } = useAuth();
    const { secondsLeft, isActive } = useSelector(
      (state: RootState) => state.appState.sessiontimer
    );
    const { reset } = useNotification();
    const interval = useInterval(() => {
      if (isActive) {
        dispatch(tick());
      }
    }, 1000);

    const logUserOut = useCallback(() => {
      if (isLoggedIn) {
        dispatch(setSession(false));
        dispatch(logOut());
        dispatch(stopTimer());
        reset();
        notifier.success({
          message: "Your session has expired, please login",
          title: "Session Expired",
        });
      }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
      if (isActive) {
        warnedRef.current = false;
        interval.start();
      } else {
        interval.stop();
      }
      return () => interval.stop();
    }, [isActive]);

    useEffect(() => {
      if (!isActive || secondsLeft == null) return;
      if (secondsLeft <= 0) {
        logUserOut();
      } else if (secondsLeft <= 120 && !warnedRef.current) {
        warnedRef.current = true;
        notifier.info({
          title: "Session Warning",
          message: `Your session will expire in ${Math.floor(
            secondsLeft / 60
          )}m ${secondsLeft % 60}s.`,
        });
      }
    }, [secondsLeft, isActive, logUserOut]);

    return <Component {...props} />;
  };
}

export default WithSession;
