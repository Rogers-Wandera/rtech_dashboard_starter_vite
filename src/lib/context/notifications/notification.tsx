import { UserNotifications } from "@/assets/app/appdefaults";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setShouldNotificationRing } from "@/lib/store/services/defaults/defaults";
import {
  useLazyGetMainNotificationsQuery,
  useLazyGetNotificationsQuery,
} from "@/lib/store/services/notifications/notification.api";
import { RootState } from "@/lib/store/store";
import { ROLES } from "@/types/enums/enum.types";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import {
  MainNotifications,
  NotificationResponse,
  Notifications,
} from "@/types/server/server.main.types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

type NotificationContextType = {
  userNotifications: Notifications;
  mainNotifications: MainNotifications;
  isLoading: boolean;
  error?: any;
  reset: () => void;
  markAsRead: (notificationId: string) => void;
  userCategories: () => { category: string; count: number }[];
  mainCategories: () => { category: string; count: number }[];
};

export enum UserNotificationCategory {
  UNREAD = "Unread",
  URGENT = "Urgent",
  SYSTEM = "System",
  ALL = "All",
  READ = "Read",
  ANNOUCEMENTS = "Announcements",
}

export enum MainNotificationCategory {
  SENT = "Sent",
  FAILED = "Failed",
  SCHEDULED = "Scheduled",
  EXPIRED = "Expired",
}

export enum NotificationTypeCombined {
  UNREAD = "Unread",
  URGENT = "Urgent",
  SYSTEM = "System",
  ALL = "All",
  READ = "Read",
  ANNOUCEMENTS = "Announcements",
  SENT = "Sent",
  FAILED = "Failed",
  SCHEDULED = "Scheduled",
  EXPIRED = "Expired",
}

const defaultState: NotificationContextType = {
  userNotifications: UserNotifications,
  mainNotifications: [],
  isLoading: false,
  error: undefined,
  reset: () => {},
  markAsRead: () => {},
  userCategories: () => [],
  mainCategories: () => [],
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotification] =
    useState<NotificationContextType>(defaultState);

  const { user, isLoggedIn } = useAuth();
  const dispatch = useAppDispatch();

  const permissions = useSelector(
    (state: RootState) => state.appState.authuser.permissions
  );

  const [getNotifications, { data, isLoading, error }] =
    useLazyGetNotificationsQuery();
  const [
    getMainNotifications,
    { data: mainNotifications, isLoading: mainLoading, error: mainError },
  ] = useLazyGetMainNotificationsQuery();

  const reset = () => {
    setNotification(defaultState);
  };

  const markAsRead = (recipientId: string) => {};

  const userCategories = useCallback(() => {
    if (notifications?.userNotifications?.length > 0) {
      return notifications.userNotifications.map((category) => ({
        category: category.category,
        count: category.count,
      }));
    }
    return [];
  }, [notifications]);

  const mainCategories = useCallback(() => {
    if (notifications?.mainNotifications?.length > 0) {
      return notifications.mainNotifications.map((category) => ({
        category: category.category,
        count: category.count,
      }));
    }
    return [];
  }, [notifications]);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      getNotifications({ userId: String(user.id) });
    }
  }, [isLoggedIn, user?.id]);

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

  console.log(notifications);

  useEffect(() => {
    if (!data && !mainNotifications) return;
    setNotification((prev) => ({
      ...prev,
      userNotifications: data ?? prev.userNotifications,
      mainNotifications: mainNotifications ?? prev.mainNotifications,
    }));
    dispatch(setShouldNotificationRing(true));
  }, [data, mainNotifications]);

  useEffect(() => {
    setNotification((prev) => ({
      ...prev,
      isLoading: isLoading || mainLoading,
      error: error || mainError,
    }));
  }, [isLoading, mainLoading, error, mainError]);

  return (
    <NotificationContext.Provider
      value={{
        ...notifications,
        reset,
        markAsRead,
        userCategories,
        mainCategories,
      }}
    >
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

export type NotificationType =
  | { type: "user"; category: keyof typeof UserNotificationCategory }
  | { type: "main"; category: keyof typeof MainNotificationCategory };

export function useNotificationType({
  type,
  category,
}: {
  type: "user";
  category: keyof typeof UserNotificationCategory;
}): NotificationResponse<NotificationRecipient> | undefined;
export function useNotificationType({
  type,
  category,
}: {
  type: "main";
  category: keyof typeof MainNotificationCategory;
}): NotificationResponse<NotificationEntity> | undefined;
export function useNotificationType({ type, category }: NotificationType) {
  const data = useNotification();
  if (type === "user") {
    return data.userNotifications.find(
      (item) => item.category === UserNotificationCategory[category]
    );
  } else {
    return data.mainNotifications.find(
      (item) => item.category === MainNotificationCategory[category]
    );
  }
}

export default NotificationContextProvider;
