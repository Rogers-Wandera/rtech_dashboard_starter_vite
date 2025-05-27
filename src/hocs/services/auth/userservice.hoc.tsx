import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocketEmit } from "@/hooks/services/socket.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useSocket } from "@/lib/context/services/socket";
import { logOut } from "@/lib/store/services/auth/auth.slice";
import { startTimer, stopTimer } from "@/lib/store/services/auth/session.slice";
import { setSession } from "@/lib/store/services/defaults/defaults";
import { notifier } from "@/lib/utils/notify/notification";
import { ROLES } from "@/types/enums/enum.types";
import { USER_EVENTS } from "@/types/enums/event.enums";
import { useEffect, useState } from "react";

export type User_Service_State = {
  online: string[];
};

export function withUserService<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function UserService(props) {
    const [userstate, setUserState] = useState<User_Service_State>({
      online: [],
    });
    const { user, sessionId } = useAuth();
    const state = useSocket("user");
    const main = useSocket("main");
    const logOutEvent = useSocketEmit(USER_EVENTS.LOGOUT);
    const dispatch = useAppDispatch();

    const HandleOnlineUsers = (data: string[]) => {
      setUserState((prev) => ({ ...prev, online: data }));
    };

    const handleSessionAlert = (data: {
      sessionId: string;
      secondsLeft: number;
    }) => {
      if (data.sessionId === sessionId) {
        dispatch(startTimer(data));
        dispatch(setSession(true));
      }
    };

    const handleSessionExpired = (data: { sessionId: string }) => {
      if (data.sessionId === sessionId) {
        main?.socket?.emit(USER_EVENTS.LOGOUT, {
          userId: user?.id,
          sessionId,
        });
        dispatch(logOut());
        dispatch(stopTimer());
        dispatch(setSession(false));
      }
    };

    const HandleLogUserOut = async (data: { message?: string }) => {
      await logOutEvent({ userId: user?.id, sessionId });
      dispatch(logOut());
      dispatch(stopTimer());
      dispatch(setSession(false));
      notifier.info({
        message: data?.message || "You have been logged out.",
        timer: 4000,
      });
    };

    const HandleForceLogOut = (data: { reason: string; message: string }) => {
      dispatch(logOut());
      dispatch(stopTimer());
      dispatch(setSession(false));
      notifier.info({
        message: data?.message || "You have been logged out.",
        timer: 4000,
        title: data?.reason || "Force Logout",
      });
    };

    useEffect(() => {
      if (!user || !state?.socket) return;
      //admin user events
      if (user.roles.includes(ROLES.ADMIN)) {
        state.socket.emit(USER_EVENTS.GET_ONLINE_USERS, { userId: user?.id });
        state.socket.on(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
      }

      state.socket.on(USER_EVENTS.LOG_USER_OUT, HandleLogUserOut);
      state.socket.on("session_alert", handleSessionAlert);
      state.socket.on("session_expired", handleSessionExpired);
      state.socket.on("force_logout", HandleForceLogOut);

      return () => {
        if (user?.roles?.includes(ROLES.ADMIN)) {
          state?.socket?.emit(USER_EVENTS.GET_ONLINE_USERS, {
            userId: user?.id,
          });
          state?.socket?.off(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
        }
        state?.socket?.off(USER_EVENTS.LOG_USER_OUT, HandleLogUserOut);
        state?.socket?.off("session_alert", handleSessionAlert);
        state?.socket?.off("session_expired", handleSessionExpired);
        state?.socket?.off("force_logout", HandleForceLogOut);
      };
    }, [user, state?.socket]);

    return <Component {...props} userstate={userstate} />;
  };
}
