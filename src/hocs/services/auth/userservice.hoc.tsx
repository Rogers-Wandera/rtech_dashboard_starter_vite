import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocketEmit } from "@/hooks/services/socket.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useSocket } from "@/lib/context/services/socket";
import { logOut } from "@/lib/store/services/auth/auth.slice";
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
    const { user } = useAuth();
    const state = useSocket();
    const emit = useSocketEmit(USER_EVENTS.LOGOUT);
    const dispatch = useAppDispatch();

    const HandleOnlineUsers = (data: string[]) => {
      setUserState((prev) => ({ ...prev, online: data }));
    };

    const HandleLogUserOut = (data: { message?: string }) => {
      dispatch(logOut());
      emit({ userId: user?.id });
      notifier.info({
        message: data?.message || "You have been logged out.",
        timer: 4000,
      });
    };

    useEffect(() => {
      if (!user || !state?.socket) return;
      state.socket.emit(USER_EVENTS.IS_LOGGED_IN, { userId: user?.id });

      //admin user events
      if (user.roles.includes(ROLES.ADMIN)) {
        state.socket.emit(USER_EVENTS.GET_ONLINE_USERS, { userId: user?.id });
        state.socket.on(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
      }

      state.socket.on(USER_EVENTS.LOG_USER_OUT, HandleLogUserOut);

      return () => {
        state?.socket?.off(USER_EVENTS.IS_LOGGED_IN);
        state?.socket?.off(USER_EVENTS.GET_ONLINE_USERS);
        state?.socket?.off(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
        state?.socket?.off(USER_EVENTS.LOG_USER_OUT, HandleLogUserOut);
      };
    }, [user, state?.socket]);
    return <Component {...props} userstate={userstate} />;
  };
}
