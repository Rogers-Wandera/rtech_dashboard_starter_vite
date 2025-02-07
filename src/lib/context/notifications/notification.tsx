import { useSocketEvent } from "@/hooks/services/socket.hooks";
import { NOTIFICATION_TYPES } from "@/types/notifications/notification.enum";
import { user_system_notifications } from "@/types/notifications/notification.types";
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext<
  user_system_notifications | undefined
>(undefined);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<user_system_notifications>({
    uploads: [],
    announcements: [],
    other: [],
  });

  useSocketEvent(
    NOTIFICATION_TYPES.USER_NOTIFICATIONS,
    (data: user_system_notifications) => {
      setNotification(data);
    }
  );
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
export default NotificationContextProvider;
