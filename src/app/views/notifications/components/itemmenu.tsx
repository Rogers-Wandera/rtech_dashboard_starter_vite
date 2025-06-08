import { useNotification } from "@/lib/context/notifications/notification";
import { NotificationRecipient } from "@/types/server/notifications/entity.types";
import { Box, Paper, useMantineTheme } from "@mantine/core";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Group } from "@mantine/core";
import { Avatar } from "@mantine/core";
import FallbackAvatar from "@/assets/images/avatars/01.png";
import { Text } from "@mantine/core";
import { IconHeart, IconMessage, IconThumbUpFilled } from "@tabler/icons-react";
import TruncatedHtml from "@/components/shared/truncatedHtml";
import { Button } from "@mantine/core";
import { Menu } from "@mantine/core";

type ItemProps = {
  setHeight?: (height: number) => void;
  notification: NotificationRecipient;
};

dayjs.extend(relativeTime);

const NotificationDropDownItem = ({ notification, setHeight }: ItemProps) => {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { markAsRead, readItems } = useNotification();
  const getTimeStamp = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    return date.from(now);
  };

  useEffect(() => {
    if (ref.current && setHeight) {
      setHeight(ref.current.clientHeight);
    }
  }, [setHeight]);

  return (
    <Menu.Item ref={ref} component="div">
      <Paper p="sm" withBorder>
        <Group wrap="nowrap" align="flex-start" gap="sm">
          {notification.notification.data?.avatar && (
            <Avatar
              src={notification.notification.data.avatar.avatar}
              size="md"
              radius="xl"
              color="blue"
            >
              {notification.notification.data.avatar.name}
            </Avatar>
          )}
          {/* fallback */}
          {!notification.notification.data?.avatar && (
            <Avatar src={FallbackAvatar} size="md" radius="xl" color="blue">
              {notification.notification.data.channel}
            </Avatar>
          )}
          <Box sx={{ flex: 1 }}>
            <Group gap={4}>
              <Text size="sm" fw={600}>
                {notification.notification.data?.avatar &&
                  notification.notification.data.avatar.name}
                {!notification.notification.data?.avatar &&
                  notification.notification.data.subject}
              </Text>
              {notification.notification.data?.avatar && (
                <IconMessage size={16} color={theme.colors.blue[5]} />
              )}
              {!notification.notification.data?.avatar && (
                <IconHeart size={16} color={theme.colors.blue[5]} />
              )}
              <Text size="sm" c="dimmed">
                {notification.priority}
              </Text>
            </Group>

            {notification.notification.data.body && (
              <TruncatedHtml
                html={notification.notification.data.body}
                textProps={{ size: "sm", mt: 4 }}
                length={100}
                withToggle={true}
              />
            )}

            <Text size="xs" c="dimmed" mt={4}>
              {getTimeStamp(String(notification.creationDate))}
            </Text>
            {notification.notification.data?.alertType === "custom" &&
              notification.readStatus !== "read" && (
                <Group justify="flex-end">
                  <Button
                    size="xs"
                    leftSection={<IconThumbUpFilled />}
                    variant="light"
                    disabled={
                      readItems.includes(notification.id) ||
                      notification.notification.data.alertType !== "custom"
                    }
                    mt={4}
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                </Group>
              )}
          </Box>
        </Group>
      </Paper>
    </Menu.Item>
  );
};

export default NotificationDropDownItem;
