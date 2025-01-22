import { useAuth } from "@/hooks/auth/auth.hooks";
import { RootState } from "@/lib/store/store";
import { METHODS, ROLES } from "@/types/enums/enum.types";
import { User_Permission } from "@/types/server/server.main.types";
import { createContext, ReactNode, useContext } from "react";
import { useSelector } from "react-redux";

export interface PermissionContextState {
  permissions: User_Permission[];
  HasPermission: (action: string, method: keyof typeof METHODS) => boolean;
}
const PermissionContext = createContext<PermissionContextState | undefined>(
  undefined
);

const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const permissions = useSelector(
    (state: RootState) => state.appState.authuser.permissions || []
  );

  function HasPermission(action: string, method: keyof typeof METHODS) {
    if (user) {
      const should = user.roles.some((role) => role === ROLES.ADMIN);
      if (should) {
        return true;
      }
      const exists = permissions.some(
        (permission) =>
          permission.roleName === action && permission.method === method
      );
      return exists;
    } else {
      return false;
    }
  }

  return (
    <PermissionContext.Provider value={{ permissions, HasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export default PermissionProvider;
