import { useEffect, useState } from "react";
import useStyles from "./styles";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { ROLES } from "@/types/enums/enum.types";
import {
  NotificationTypeCombined,
  useNotification,
  useNotificationType,
} from "@/lib/context/notifications/notification";
import NotificationDetails from "./components/details/details";
import CreateNotification from "./create";
import { NotificationSidebar } from "./sidebar";
import { NotificationContent } from "./content";
import { MobileNotificationMenu } from "./mobile";
import { NotificationResponse } from "@/types/server/server.main.types";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import {
  AlertType,
  RecipientRead,
} from "@/types/server/notifications/notification.types";
import { Alert, Center } from "@mantine/core";
import { IconAlertTriangle, IconReload } from "@tabler/icons-react";
import { Text } from "@mantine/core";
import { Button } from "@mantine/core";

type Filtered =
  | {
      type: "user";
      data: NotificationResponse<NotificationRecipient> | undefined;
    }
  | {
      type: "main";
      data: NotificationResponse<NotificationEntity> | undefined;
    };

const NotificationPage = () => {
  const { user } = useAuth();
  const { classes, cx } = useStyles();

  const permissions = useSelector(
    (state: RootState) => state.appState.authuser.permissions || []
  );
  const hasPermissions = permissions.some(
    (permission) =>
      permission.roleName === "Get main notifications" &&
      permission.method === "GET"
  );
  const isAdmin = user?.roles?.includes(ROLES.ADMIN) ?? false;
  const isAuthorized = isAdmin || hasPermissions;

  const [selectedNotification, setSelectedNotification] = useState<
    NotificationRecipient | NotificationEntity | null
  >(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationTypeCombined>(
    NotificationTypeCombined.ALL
  );

  const {
    userNotifications,
    mainNotifications,
    userCategories,
    mainCategories,
    markAsRead,
    error,
    reset,
    setRefetch,
  } = useNotification();

  const allNotifications = useNotificationType({
    type: "user",
    category: "ALL",
  });

  const [filtered, setFiltered] = useState<Filtered>({
    type: "user",
    data: {
      category: NotificationTypeCombined.ALL,
      count: 0,
      items: [],
    },
  });

  const [createModalOpen, { open: openCreateModal }] = useDisclosure(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpenDetails = (
    notification: NotificationEntity | NotificationRecipient
  ) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);

    const readTypes = [AlertType.CUSTOM, AlertType.ERROR, AlertType.WARNING];

    if ("readStatus" in notification) {
      if (readTypes.includes(notification.notification.data.alertType)) {
        if (notification.readStatus !== RecipientRead.UNREAD) return;
        markAsRead(notification.id);
      }
    }
  };

  const handleReload = () => {
    reset();
    setFiltered({
      type: "user",
      data: allNotifications,
    });
  };

  const getCount = filtered?.data?.count || 0;

  useEffect(() => {
    setFiltered({
      type: "user",
      data: allNotifications,
    });
  }, [allNotifications]);

  useEffect(() => {
    setRefetch(true);
  }, []);

  if (createModalOpen) {
    return <CreateNotification />;
  }

  if (error) {
    return (
      <Center className={classes.errorContainer}>
        <Alert
          title="Error loading notifications"
          color="red"
          icon={<IconAlertTriangle />}
          className={classes.errorAlert}
        >
          <Text mb="md">
            {error?.message || "Failed to load notifications"}
          </Text>
          <Button
            leftSection={<IconReload size={16} />}
            onClick={handleReload}
            color="red"
          >
            Reload Notifications
          </Button>
        </Alert>
      </Center>
    );
  }

  return (
    <div className={classes.notificationContainer}>
      {isMobile ? (
        <>
          <MobileNotificationMenu
            classes={classes}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setFiltered={setFiltered}
            userCats={userCategories}
            mainCats={mainCategories}
            userNotifications={userNotifications}
            mainNotifications={mainNotifications}
            isAuthorized={isAuthorized}
            cx={cx}
          />
          <NotificationContent
            classes={classes}
            activeFilter={activeFilter}
            getCount={getCount}
            filtered={filtered}
            handleOpenDetails={handleOpenDetails}
            cx={cx}
          />
        </>
      ) : (
        <>
          <NotificationSidebar
            classes={classes}
            cx={cx}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setFiltered={setFiltered}
            userCats={userCategories}
            mainCats={mainCategories}
            userNotifications={userNotifications}
            mainNotifications={mainNotifications}
            isAuthorized={isAuthorized}
            openCreateModal={openCreateModal}
          />
          <NotificationContent
            classes={classes}
            activeFilter={activeFilter}
            getCount={getCount}
            filtered={filtered}
            handleOpenDetails={handleOpenDetails}
            cx={cx}
          />
        </>
      )}

      <NotificationDetails
        item={selectedNotification}
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        classes={classes}
      />
    </div>
  );
};

export default NotificationPage;

NotificationPage.displayName = "NotificationPage";
