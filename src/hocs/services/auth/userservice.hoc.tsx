import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocket } from "@/lib/context/services/socket";
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

    const HandleOnlineUsers = (data: string[]) => {
      setUserState((prev) => ({ ...prev, online: data }));
    };

    useEffect(() => {
      if (!user || !state?.socket) return;
      state.socket.emit(USER_EVENTS.IS_LOGGED_IN, { userId: user?.id });

      //admin user events
      if (user.roles.includes(ROLES.ADMIN)) {
        state.socket.emit(USER_EVENTS.GET_ONLINE_USERS, { userId: user?.id });
        state.socket.on(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
      }

      return () => {
        state?.socket?.off(USER_EVENTS.IS_LOGGED_IN);
        state?.socket?.off(USER_EVENTS.GET_ONLINE_USERS);
        state?.socket?.off(USER_EVENTS.ONLINE_USERS, HandleOnlineUsers);
      };
    }, [user, state?.socket]);
    return <Component {...props} userstate={userstate} />;
  };
}
