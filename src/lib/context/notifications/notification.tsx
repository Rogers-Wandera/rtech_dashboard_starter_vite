import { useSocketEvent } from "@/hooks/services/socket.hooks";
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPES,
} from "@/types/notifications/notification.enum";
import { user_system_notifications } from "@/types/notifications/notification.types";
import { createContext, useContext, useState } from "react";

export type NotificationCounts = {
  uploads: number;
  announcements: number;
  other: number;
  unread: number;
  all: number;
  urgent: number;
};

const NotificationContext = createContext<
  | {
      notifications: user_system_notifications;
      counts: NotificationCounts;
    }
  | undefined
>(undefined);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotification] = useState<user_system_notifications>({
    uploads: [],
    announcements: [],
    other: [],
    unread: [],
    all: [],
    urgent: [],
  });

  const [counts, setCounts] = useState<NotificationCounts>({
    uploads: 0,
    announcements: 0,
    other: 0,
    unread: 0,
    all: 0,
    urgent: 0,
  });

  const HandleCount = (data: user_system_notifications) => {
    const uploads = data?.uploads || [];
    const announcements = data?.announcements || [];
    const other = data?.other || [];
    const all = data?.all || [];
    const unread = data?.unread || [];
    const urgent = data?.urgent || [];
    const uploadcount = uploads.reduce((acc, curlValue) => {
      if (curlValue.status !== NOTIFICATION_STATUS.READ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    const announcementcount = announcements.reduce((acc, curlValue) => {
      if (curlValue.status !== NOTIFICATION_STATUS.READ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    const othercount = other.reduce((acc, curlValue) => {
      if (curlValue.status !== NOTIFICATION_STATUS.READ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    setCounts({
      uploads: uploadcount,
      announcements: announcementcount,
      other: othercount,
      unread: unread.length,
      all: all.length,
      urgent: urgent.length,
    });
  };

  useSocketEvent(
    NOTIFICATION_TYPES.USER_NOTIFICATIONS,
    (data: user_system_notifications) => {
      setNotification(data);
      HandleCount(data);
    }
  );

  return (
    <NotificationContext.Provider value={{ notifications, counts }}>
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
