import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  rem,
  Text,
} from "@mantine/core";
import { motion } from "framer-motion";
import { Notification } from "@/types/notifications/notification.types";
import NotificationBadge from "./badge";
import { IconArrowRight, IconClock } from "@tabler/icons-react";

const NotificationItem = ({
  notification,
  onMarkAsRead,
  classes,
  cx,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  classes: Record<string, any>;
  cx: (...args: any) => string;
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        p="md"
        mb="sm"
        className={cx(classes.notification, classes[notification.type])}
        radius="md"
      >
        <Group align="flex-start" wrap="nowrap">
          {notification.sender && (
            <Avatar
              src={notification.sender.avatar}
              size="md"
              color="blue"
              radius="xl"
            >
              {notification.sender.name[0]}
            </Avatar>
          )}

          <div className={classes.notificationContent}>
            <Group justify="space-between" gap="xs" wrap="nowrap">
              <Text fw={600} lineClamp={1}>
                {notification.title}
              </Text>
              <NotificationBadge type={notification.type} classes={classes} />
            </Group>

            <Text size="sm" lineClamp={2} mt={4}>
              {notification.message}
            </Text>

            {notification.imageUrl && (
              <Box className={classes.mediaContainer} mt="sm">
                <img
                  src={notification.imageUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: rem(120),
                    objectFit: "cover",
                  }}
                />
                <Badge className={classes.mediaBadge} size="xs">
                  Image
                </Badge>
              </Box>
            )}

            <Group justify="space-between" mt="sm">
              <div className={classes.timestamp}>
                <IconClock size={14} />
                <Text size="xs">{formatTime(notification.timestamp)}</Text>
              </div>

              {notification.type === "unread" && (
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={<IconArrowRight size={14} />}
                  className={classes.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  Mark as read
                </Button>
              )}
            </Group>
          </div>
        </Group>
      </Paper>
    </motion.div>
  );
};

export default NotificationItem;
