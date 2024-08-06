import { RootState } from "@/lib/store/store";
import { AuthContextState } from "@/types/app/auth/auth.types";
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
  const token = useSelector(
    (state: RootState) => state.appState.authuser.token
  );
  const user = useSelector((state: RootState) => state.appState.authuser.user);
  const modules = useSelector(
    (state: RootState) => state.appState.authuser.modules
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
