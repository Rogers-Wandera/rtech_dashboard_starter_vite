import { UserNotifications } from "@/assets/app/appdefaults";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setShouldNotificationRing } from "@/lib/store/services/defaults/defaults";
import {
  useLazyGetMainNotificationsQuery,
  useLazyGetNotificationsQuery,
} from "@/lib/store/services/notifications/notification.api";
import { RootState } from "@/lib/store/store";
import { ROLES, USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import {
  MainNotifications,
  NotificationResponse,
  Notifications,
} from "@/types/server/server.main.types";
import { useDebouncedCallback, useDebouncedValue } from "@mantine/hooks";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { NOTIFICATION_PATTERN } from "@/types/server/notifications/notification.types";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { useSocketEvent } from "@/hooks/services/socket.hooks";

export type Category = {
  category: string;
  count: number;
};

export type NotificationContextType = {
  userNotifications: Notifications;
  mainNotifications: MainNotifications;
  isLoading: boolean;
  error?: any;
  reset: () => void;
  markAsRead: (notificationId: string) => void;
  userCategories: Category[];
  mainCategories: Category[];
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  dateRange: [string | null, string | null];
  setDateRange: Dispatch<SetStateAction<[string | null, string | null]>>;
  readItems: string[];
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

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userNotifications, setUserNotifications] =
    useState<Notifications>(UserNotifications);
  const [MainNotifications, setMainNotifications] = useState<MainNotifications>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<any>();
  const { mutateAsync } = useMutateData({
    queryKey: "update_notification_read",
  });

  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [readItems, setReadItems] = useState<Set<string>>(new Set());

  const permissions = useSelector(
    (state: RootState) => state.appState.authuser.permissions
  );

  const filteredUserNotifications = useMemo(() => {
    if (!searchQuery) return userNotifications;
    return userNotifications.map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.notification.subject
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          (item.notification.data.subject || " ")
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      ),
    }));
  }, [userNotifications, searchQuery]);

  const filteredMainNotifications = useMemo(() => {
    if (!searchQuery) return MainNotifications;
    return MainNotifications.map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    }));
  }, [MainNotifications, searchQuery]);

  const [getNotifications, { data }] = useLazyGetNotificationsQuery();
  const [getMainNotifications, { data: mainNotifications }] =
    useLazyGetMainNotificationsQuery();

  const reset = () => {
    setUserNotifications(UserNotifications);
    setMainNotifications([]);
    setSearchQuery("");
    setDateRange([null, null]);
  };

  const markAsRead = useCallback(async (recipientId: string | string[]) => {
    const isArray = Array.isArray(recipientId);
    const data = isArray ? recipientId : [recipientId];
    if (data?.length > 0) {
      data.forEach((id) => {
        setReadItems((prev) => new Set(prev).add(id));
      });
      await HandleUpdateRead(data);
    }
  }, []);

  const HandleUpdateRead = async (items: string[]) => {
    try {
      const response = await mutateAsync({
        method: USE_MUTATE_METHODS.PATCH,
        endPoint: `/core/notifications/${user?.id}`,
        payload: {
          readItems: items,
        },
      });

      return String(response?.msg) ? true : false;
    } catch (error) {
      return false;
    }
  };

  const userCategories = useMemo(() => {
    return filteredUserNotifications.map((category) => ({
      category: category.category,
      count: category.items.length,
    }));
  }, [filteredUserNotifications]);

  const mainCategories = useMemo(() => {
    return filteredMainNotifications.map((category) => ({
      category: category.category,
      count: category.items.length,
    }));
  }, [filteredMainNotifications]);

  const fetchNotifications = useDebouncedCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const hasClientResults =
        debouncedSearch?.length > 0 &&
        (filteredUserNotifications.some((c) => c.items.length > 0) ||
          filteredMainNotifications.some((c) => c.items.length > 0));
      if (!hasClientResults) {
        await Promise.all([
          getNotifications({
            userId: String(user.id),
            globalFilter: debouncedSearch,
            dateFilter: { from: dateRange[0], to: dateRange[1] },
          }),
          user?.roles.includes(ROLES.ADMIN) ||
          permissions?.some(
            (p) => p.roleName === "Get main notifications" && p.method === "GET"
          )
            ? getMainNotifications({
                userId: String(user.id),
                globalFilter: debouncedSearch,
                dateFilter: { from: dateRange[0], to: dateRange[1] },
              })
            : Promise.resolve(),
        ]);
        setReadItems(new Set());
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, debouncedSearch, dateRange, permissions]);

  useEffect(() => {
    if (data) setUserNotifications(data);
    if (mainNotifications) setMainNotifications(mainNotifications);
    dispatch(setShouldNotificationRing(true));
  }, [data, mainNotifications]);

  useSocketEvent(
    NOTIFICATION_PATTERN.GET_NOTIFICATIONS,
    (data: { userId: string }) => {
      if (user?.id === data?.userId) {
        fetchNotifications();
      }
    }
  );

  return (
    <NotificationContext.Provider
      value={{
        userNotifications: filteredUserNotifications,
        mainNotifications: filteredMainNotifications,
        isLoading,
        error,
        reset,
        markAsRead,
        userCategories,
        mainCategories,
        searchQuery,
        setSearchQuery,
        dateRange,
        setDateRange,
        readItems: Array.from(readItems),
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
