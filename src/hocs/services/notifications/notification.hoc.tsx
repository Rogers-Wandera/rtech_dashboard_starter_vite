import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocketEvent } from "@/hooks/services/socket.hooks";
import { NOTIFICATION_TYPES } from "@/types/notifications/notification.enum";
import { useEffect } from "react";

export function withNotification<P extends Object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function Notification(props) {
    const { user } = useAuth();

    const data = useSocketEvent(
      NOTIFICATION_TYPES.SYSTEM_NOTIFICATION,
      (data) => {
        console.log(data);
      }
    );

    useEffect(() => {
      if (user) {
      }
    }, []);
    return <Component {...props} />;
  };
}
