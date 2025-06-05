import { useEffect, useState } from "react";
import useStyles from "./styles";
import { Notification } from "@/types/notifications/notification.types";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications_data } from "./notifications_data";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBell,
  IconClock,
  IconFilter,
  IconMail,
  IconMessage,
  IconMicrophone2,
  IconPlus,
  IconSend,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import NotificationFilterCard from "./components/filtercard";
import { AnimatePresence } from "framer-motion";
import NotificationItem from "./components/item";
import NotificationDetails from "./components/details/details";
import CreateNotification from "./create";
import {
  NotificationTypeCombined,
  useNotification,
  useNotificationType,
} from "@/lib/context/notifications/notification";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { ROLES } from "@/types/enums/enum.types";

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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationTypeCombined>(
    NotificationTypeCombined.ALL
  );

  const { userNotifications, userCategories, mainCategories } =
    useNotification();

  const userCats = userCategories();
  const mainCats = mainCategories();

  const getCount =
    useNotificationType({ type: "user", category: "ALL" })?.count || 0;

  const [createModalOpen, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Sample notifications data
  useEffect(() => {
    setNotifications(notifications_data);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, type: "Read" as NotificationTypeCombined } : n
      )
    );
  };

  const handleOpenDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);

    // Auto-mark as read when opened
    if (notification.type === "unread") {
      handleMarkAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === NotificationTypeCombined.ALL) return true;
    return n.type === activeFilter;
  });

  const handleCreateNotification = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
  };

  return (
    <div className={classes.notificationContainer}>
      {!createModalOpen && (
        <>
          <div className={classes.sidebar}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              className={classes.createButton}
              onClick={openCreateModal}
              disabled={true}
            >
              Create Notification
            </Button>

            <Card withBorder p="md" mb="md">
              <Text fw={500} mb="sm" display="flex" ta="center">
                <IconFilter size={16} style={{ marginRight: "8px" }} />
                Filter Notifications
              </Text>
              {userCats &&
                userCats?.length > 0 &&
                userCats.map((category, i) => {
                  let icon = <IconBell size={18} />;
                  if (category.category === "System")
                    icon = <IconSettings size={18} />;
                  if (category.category === "Unread")
                    icon = <IconMail size={18} />;
                  if (category.category === "Urgent")
                    icon = <IconAlertTriangle size={18} />;
                  if (category.category === "Read")
                    icon = <IconMessage size={18} />;
                  if (category.category === "Announcements")
                    icon = <IconMicrophone2 size={18} />;

                  return (
                    <NotificationFilterCard
                      key={category.category + i}
                      icon={icon}
                      label={category.category}
                      count={category.count}
                      active={
                        activeFilter ===
                        (category.category as NotificationTypeCombined)
                      }
                      onClick={() =>
                        setActiveFilter(
                          category.category as NotificationTypeCombined
                        )
                      }
                      classes={classes}
                      cx={cx}
                    />
                  );
                })}
              {isAuthorized &&
                mainCats &&
                mainCats?.length > 0 &&
                mainCats.map((category, i) => {
                  let icon = <IconSend size={18} />;
                  if (category.category === "Failed")
                    icon = <IconX size={18} />;
                  if (category.category === "Scheduled")
                    icon = <IconClock size={18} />;
                  if (category.category === "Expired")
                    icon = <IconAlertTriangle size={18} />;
                  return (
                    <NotificationFilterCard
                      key={category.category + i}
                      icon={icon}
                      label={category.category}
                      count={category.count}
                      active={
                        activeFilter ===
                        (category.category as NotificationTypeCombined)
                      }
                      onClick={() =>
                        setActiveFilter(
                          category.category as NotificationTypeCombined
                        )
                      }
                      classes={classes}
                      cx={cx}
                    />
                  );
                })}
              {/* <NotificationFilterCard
                icon={<IconBell size={18} />}
                label={NotificationTypeCombined.ALL}
                count={notifications.length}
                active={activeFilter === NotificationTypeCombined.ALL}
                onClick={() => setActiveFilter(NotificationTypeCombined.ALL)}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconMail size={18} />}
                label={NotificationTypeCombined.UNREAD}
                count={unreadCount}
                active={activeFilter === NotificationTypeCombined.UNREAD}
                onClick={() => setActiveFilter(NotificationTypeCombined.UNREAD)}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconAlertTriangle size={18} />}
                label={NotificationTypeCombined.URGENT}
                count={urgentCount}
                active={activeFilter === NotificationTypeCombined.URGENT}
                onClick={() => setActiveFilter(NotificationTypeCombined.URGENT)}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconSend size={18} />}
                label={NotificationTypeCombined.SENT}
                count={sentCount}
                active={activeFilter === NotificationTypeCombined.SENT}
                onClick={() => setActiveFilter(NotificationTypeCombined.SENT)}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconSettings size={18} />}
                label={NotificationTypeCombined.SYSTEM}
                count={systemCount}
                active={activeFilter === NotificationTypeCombined.SYSTEM}
                onClick={() => setActiveFilter(NotificationTypeCombined.SYSTEM)}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconMessage size={18} />}
                label={NotificationTypeCombined.READ}
                count={readCount}
                active={activeFilter === NotificationTypeCombined.READ}
                onClick={() => setActiveFilter(NotificationTypeCombined.READ)}
                classes={classes}
                cx={cx}
              /> */}
            </Card>
          </div>

          <div className={classes.mainContent}>
            <Box className={classes.header}>
              <Group justify="apart">
                <Text size="xl" fw={700}>
                  {activeFilter === NotificationTypeCombined.ALL
                    ? "All Notifications"
                    : `${
                        activeFilter.charAt(0).toUpperCase() +
                        activeFilter.slice(1)
                      } Notifications`}
                </Text>
                <Badge
                  variant="filled"
                  size="lg"
                  color={getCount > 0 ? "blue" : "gray"}
                >
                  {getCount} shown
                </Badge>
              </Group>
            </Box>

            <Box mt="md">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleOpenDetails(notification)}
                    >
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        classes={classes}
                        cx={cx}
                      />
                    </div>
                  ))
                ) : (
                  <Box className={classes.emptyState}>
                    <Text size="lg" mb="sm">
                      No notifications found
                    </Text>
                    <Text c="dimmed">
                      {activeFilter === NotificationTypeCombined.ALL
                        ? "You don't have any notifications yet."
                        : `You don't have any ${activeFilter} notifications.`}
                    </Text>
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          </div>

          <NotificationDetails
            notification={selectedNotification}
            opened={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            classes={classes}
          />
        </>
      )}
      {createModalOpen && <CreateNotification />}
    </div>
  );
};

export default NotificationPage;

NotificationPage.displayName = "NotificationPage";
