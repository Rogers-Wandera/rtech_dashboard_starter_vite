import RingingBellWithBadge from "@/components/shared/ringingbell";
import TruncatedHtml from "@/components/shared/truncatedHtml";
import { useAppDispatch } from "@/hooks/store.hooks";
import {
  useNotification,
  useNotificationType,
} from "@/lib/context/notifications/notification";
import { setShouldNotificationRing } from "@/lib/store/services/defaults/defaults";
import { RootState } from "@/lib/store/store";
import {
  Group,
  Text,
  Avatar,
  Paper,
  Badge,
  Menu,
  ScrollArea,
  Button,
  Box,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMessage,
  IconHeart,
  IconBellFilled,
  IconThumbUpFilled,
  IconX,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import FallbackAvatar from "@/assets/images/avatars/01.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router";

dayjs.extend(relativeTime);

const NotificationDropdown = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isOpened = useSelector(
    (state: RootState) => state.appState.defaultstate.shouldNotificationRing
  );

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const notification = useNotificationType({
    type: "user",
    category: "UNREAD",
  });

  const { markAsRead } = useNotification();

  const unreadCount = notification?.count || 0;

  const theme = useMantineTheme();

  const HandleOpen = () => {
    dispatch(setShouldNotificationRing(false));
    toggle();
  };

  const getTimeStamp = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    return date.from(now);
  };

  return (
    <Menu
      width={360}
      transitionProps={{ transition: "rotate-left" }}
      onClose={close}
      onOpen={HandleOpen}
      zIndex={9999}
      opened={opened}
      withArrow
      closeOnItemClick={false}
    >
      <Menu.Target>
        <Box sx={{ position: "relative" }}>
          {unreadCount <= 0 && (
            <IconBellFilled size={27} style={{ cursor: "pointer" }} />
          )}
          {unreadCount > 0 && (
            <RingingBellWithBadge count={unreadCount} shouldRing={isOpened} />
          )}
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between">
            <Group gap={4}>
              <Text size="sm" fw={600}>
                Notifications
              </Text>
              <Badge variant="light" color="blue" size="sm">
                {unreadCount &&
                  `${unreadCount >= 100 ? "99+" : unreadCount} new`}
                {unreadCount <= 0 && "No new notifications"}
              </Badge>
            </Group>
            <ActionIcon onClick={close}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Menu.Label>

        {notification && notification?.items?.length && (
          <ScrollArea.Autosize mah={300} type="scroll">
            {notification.items.slice(0, 5).map((notification) => (
              <Menu.Item key={notification.id}>
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
                      <Avatar
                        src={FallbackAvatar}
                        size="md"
                        radius="xl"
                        color="blue"
                      >
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
                                notification.notification.data.alertType !==
                                "custom"
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
            ))}
          </ScrollArea.Autosize>
        )}

        {(!notification || notification?.items?.length === 0) && (
          <Box p="md" sx={{ textAlign: "center" }}>
            <Text size="sm" c="dimmed">
              No notifications yet
            </Text>
          </Box>
        )}

        <Menu.Divider />

        <Box px="sm" pb="sm">
          <Button
            fullWidth
            variant="light"
            disabled={!notification || notification?.items?.length === 0}
            onClick={() => navigate("/dashboard/core/notifications")}
          >
            See all incoming activity
          </Button>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationDropdown;

NotificationDropdown.displayName = "NotificationDropdown";
