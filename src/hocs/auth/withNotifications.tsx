import { useAuth } from "@/hooks/auth/auth.hooks";
import {
  useGetNotificationsQuery,
  useLazyGetMainNotificationsQuery,
} from "@/lib/store/services/notifications/notification.api";
import { RootState } from "@/lib/store/store";
import { ROLES } from "@/types/enums/enum.types";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function withNotifications<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WithNotifications(props) {
    const { user, isLoggedIn } = useAuth();

    const permissions = useSelector(
      (state: RootState) => state.appState.authuser.permissions
    );

    const { refetch, isLoading, isFetching, data } = useGetNotificationsQuery(
      {
        userId: String(user?.id),
      },
      {
        skip: !isLoggedIn,
      }
    );
    const [getMainNotifications, { data: mainNotifications }] =
      useLazyGetMainNotificationsQuery();

    console.log(data, mainNotifications);
    useEffect(() => {
      if (isLoggedIn) {
        refetch();
      }
    }, [isLoggedIn]);

    useEffect(() => {
      const hasPermission = permissions?.find(
        (permission) =>
          permission.roleName === "Get main notifications" &&
          permission.method === "GET"
      );
      if (user?.roles.includes(ROLES.ADMIN) || hasPermission) {
        getMainNotifications({ userId: String(user?.id) });
      }
    }, [user, isLoggedIn, permissions]);
    return <Component {...props} />;
  };
}

export default withNotifications;
