import { useAuth } from "@/hooks/auth/auth.hooks";
import { useGetNotificationsQuery } from "@/lib/store/services/notifications/notification.api";
import { useEffect } from "react";

function withNotifications<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WithNotifications(props) {
    const { user, isLoggedIn } = useAuth();
    const { refetch, isLoading, isFetching, data } = useGetNotificationsQuery(
      {
        userId: String(user?.id),
      },
      {
        skip: !isLoggedIn,
      }
    );
    console.log(data);
    useEffect(() => {
      if (isLoggedIn) {
        refetch();
      }
    }, [isLoggedIn]);
    return <Component {...props} />;
  };
}

export default withNotifications;
