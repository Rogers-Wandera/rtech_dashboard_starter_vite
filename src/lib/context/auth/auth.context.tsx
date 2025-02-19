import { useSocketEvent } from "@/hooks/services/socket.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import {
  useLazyGetUserModulesQuery,
  useLazyPermissionsQuery,
} from "@/lib/store/services/auth/auth.api";
import { setToken, setUser } from "@/lib/store/services/auth/auth.slice";
import { RootState } from "@/lib/store/store";
import { notifier } from "@/lib/utils/notify/notification";
import { AuthContextState, TypeToken } from "@/types/app/auth/auth.types";
import { USER_EVENTS } from "@/types/enums/event.enums";
import { jwtDecode } from "jwt-decode";
import { createContext } from "react";
import { useSelector } from "react-redux";

export const AuthContext = createContext<AuthContextState>({
  isLoggedIn: false,
  token: null,
  user: null,
  modules: {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.appState.authuser.isLoggedIn
  );

  const dispatch = useAppDispatch();
  const token = useSelector(
    (state: RootState) => state.appState.authuser.token
  );
  const user = useSelector((state: RootState) => state.appState.authuser.user);
  const [getUserModules] = useLazyGetUserModulesQuery();
  const [getPermissions] = useLazyPermissionsQuery();

  const modules = useSelector(
    (state: RootState) => state.appState.authuser.modules
  );
  useSocketEvent(
    USER_EVENTS.UPDATE_SESSION,
    (data: { token: string; message?: string }) => {
      dispatch(setToken(data.token));
      const decodeToken = jwtDecode<TypeToken>(data.token);
      dispatch(setUser(decodeToken.user));
      if (data?.message) {
        notifier.success({ message: data.message });
      }
    }
  );

  useSocketEvent(
    USER_EVENTS.FETCH_MODULES,
    async (data: { message: string }) => {
      if (!user) {
        return;
      }
      await getUserModules(user.id);
      await getPermissions(user.id);
      notifier.info({ message: data.message });
    }
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        modules,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
