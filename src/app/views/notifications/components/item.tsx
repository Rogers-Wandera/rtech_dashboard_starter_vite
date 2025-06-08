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
import NotificationBadge from "./badge";
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import { AlertType } from "@/types/server/notifications/notification.types";
import TruncatedHtml from "@/components/shared/truncatedHtml";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FallbackAvatar from "@/assets/images/avatars/01.png";
import { useEffect, useRef } from "react";
import { useNotification } from "@/lib/context/notifications/notification";

type Props = {
  item: NotificationRecipient | NotificationEntity;
  classes: Record<string, any>;
  cx: (...args: any) => string;
};

dayjs.extend(relativeTime);

const NotificationItem = ({
  item,
  classes,
  cx,
  setHeight,
}: Props & { setHeight?: (height: number) => void }) => {
  const getTimeStamp = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    return date.from(now);
  };

  if (!item) return null;
  const ref = useRef<HTMLDivElement>(null);

  const { markAsRead, readItems } = useNotification();

  const notification = "notification" in item ? item.notification : item;
  const hasRead = "readStatus" in item && item.readStatus === "unread";

  const { data } = notification;

  const getType = () => {
    if ("readStatus" in item && data?.alertType === AlertType.CUSTOM) {
      if (item.readStatus === "read") {
        return "read";
      } else if (item.readStatus === "unread" && item.priority === "high") {
        return "urgent";
      } else if (item.readStatus === "unread") {
        return "unread";
      }
    } else if (
      data?.alertType === AlertType.ANNOUCEMENT ||
      data?.alertType === AlertType.SYSTEM
    ) {
      return "system";
    } else if (data?.alertType === AlertType.MAINTENANCE) {
      return "urgent";
    } else {
      return "none";
    }
  };

  useEffect(() => {
    if (ref.current && setHeight) {
      setHeight(ref.current.clientHeight);
    }
  }, [setHeight]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      ref={ref}
    >
      <Paper
        p="md"
        mb="sm"
        className={cx(classes.notification, classes[getType() || "none"])}
        radius="md"
      >
        <Group align="flex-start" wrap="nowrap">
          {data?.avatar && (
            <Avatar src={data.avatar.avatar} size="md" color="blue" radius="xl">
              {data.avatar.name}
            </Avatar>
          )}

          {!data?.avatar && (
            <Avatar src={FallbackAvatar} size="md" radius="xl" color="blue">
              {data.channel}
            </Avatar>
          )}

          <div className={classes.notificationContent}>
            <Group justify="space-between" gap="xs" wrap="nowrap">
              <Text fw={600} lineClamp={1}>
                {notification.subject}
              </Text>
              <NotificationBadge type={getType() || "none"} classes={classes} />
            </Group>

            <TruncatedHtml
              html={data.body}
              length={100}
              withToggle
              textProps={{ size: "sm", lineClamp: 2, mt: 4 }}
            />

            {data.channel === "push" &&
              data.provider === "socket" &&
              data?.coverImage && (
                <Box className={classes.mediaContainer} mt="sm">
                  <img
                    src={data.coverImage}
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
                <Text size="xs">
                  {getTimeStamp(String(notification.creationDate))}
                </Text>
              </div>

              {hasRead && (
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={<IconArrowRight size={14} />}
                  className={classes.actionButton}
                  disabled={readItems.includes(item.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(item.id);
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
