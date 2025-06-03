import { useEffect, useState } from "react";
import useStyles from "./styles";
import { Notification } from "@/types/notifications/notification.types";
import { NotificationType } from "@/types/notifications/notification.enum";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications_data } from "./notifications_data";
import { Badge, Box, Button, Card, Group, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBell,
  IconFilter,
  IconMail,
  IconMessage,
  IconPlus,
  IconSend,
  IconSettings,
} from "@tabler/icons-react";
import NotificationFilterCard from "./components/filtercard";
import { AnimatePresence } from "framer-motion";
import NotificationItem from "./components/item";
import NotificationDetails from "./components/details/details";
import CreateNotification from "./create";

const NotificationPage = () => {
  const { classes, cx } = useStyles();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">(
    "all"
  );
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
        n.id === id ? { ...n, type: "read" as NotificationType } : n
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
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => n.type === "unread").length;
  const urgentCount = notifications.filter((n) => n.type === "urgent").length;
  const sentCount = notifications.filter((n) => n.type === "sent").length;
  const systemCount = notifications.filter((n) => n.type === "system").length;
  const readCount = notifications.filter((n) => n.type === "read").length;

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
              <NotificationFilterCard
                icon={<IconBell size={18} />}
                label="All"
                count={notifications.length}
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconMail size={18} />}
                label="Unread"
                count={unreadCount}
                active={activeFilter === "unread"}
                onClick={() => setActiveFilter("unread")}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconAlertTriangle size={18} />}
                label="Urgent"
                count={urgentCount}
                active={activeFilter === "urgent"}
                onClick={() => setActiveFilter("urgent")}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconSend size={18} />}
                label="Sent"
                count={sentCount}
                active={activeFilter === "sent"}
                onClick={() => setActiveFilter("sent")}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconSettings size={18} />}
                label="System"
                count={systemCount}
                active={activeFilter === "system"}
                onClick={() => setActiveFilter("system")}
                classes={classes}
                cx={cx}
              />
              <NotificationFilterCard
                icon={<IconMessage size={18} />}
                label="Read"
                count={readCount}
                active={activeFilter === "read"}
                onClick={() => setActiveFilter("read")}
                classes={classes}
                cx={cx}
              />
            </Card>
          </div>

          <div className={classes.mainContent}>
            <Box className={classes.header}>
              <Group justify="apart">
                <Text size="xl" fw={700}>
                  {activeFilter === "all"
                    ? "All Notifications"
                    : `${
                        activeFilter.charAt(0).toUpperCase() +
                        activeFilter.slice(1)
                      } Notifications`}
                </Text>
                <Badge
                  variant="filled"
                  size="lg"
                  color={unreadCount > 0 ? "blue" : "gray"}
                >
                  {filteredNotifications.length} shown
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
                      {activeFilter === "all"
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
