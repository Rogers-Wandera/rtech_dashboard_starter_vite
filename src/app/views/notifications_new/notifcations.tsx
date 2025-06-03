import RingingBellWithBadge from "@/components/shared/ringingbell";
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
import { useState } from "react";

interface Notification {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: "commented" | "liked";
  target?: string;
  message?: string;
  timestamp: string;
}

const NotificationDropdown = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      user: {
        name: "Kate Young",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      action: "commented",
      target: "your photo",
      message:
        "Great Shot Adam! Really enjoying the composition on this piece.",
      timestamp: "5 mins ago",
    },
    {
      id: "2",
      user: {
        name: "Brandon Newman",
        avatar: "https://i.pravatar.cc/150?img=11",
      },
      action: "liked",
      target: "your album: UI/UX Inspo",
      timestamp: "21 mins ago",
    },
    {
      id: "3",
      user: {
        name: "Dave Wood",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      action: "liked",
      target: "your photo: Daily UI Challenge 049",
      timestamp: "2hrs ago",
    },
    {
      id: "4",
      user: {
        name: "Kate Young",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      action: "liked",
      target: "your photo: Daily UI Challenge 049",
      timestamp: "3hrs ago",
    },
    {
      id: "5",
      user: {
        name: "Anna Lee",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      action: "commented",
      target: "your photo",
      message: "Woah! Loving these colours! Keep it up",
      timestamp: "1 day ago",
    },
  ]);

  const theme = useMantineTheme();
  const unreadCount = notifications.filter(
    (n) => n.timestamp.includes("mins") || n.timestamp.includes("hr")
  ).length;

  const getActionIcon = (action: string) => {
    switch (action) {
      case "commented":
        return <IconMessage size={16} color={theme.colors.blue[5]} />;
      case "liked":
        return <IconHeart size={16} color={theme.colors.red[5]} />;
      default:
        return null;
    }
  };

  return (
    <Menu
      width={360}
      transitionProps={{ transition: "rotate-left" }}
      onClose={close}
      onOpen={toggle}
      zIndex={9999}
      opened={opened}
      withArrow
      closeOnItemClick={false}
    >
      <Menu.Target>
        <Box sx={{ position: "relative" }}>
          {unreadCount > 0 && (
            <IconBellFilled size={27} style={{ cursor: "pointer" }} />
          )}
          {unreadCount <= 0 && <RingingBellWithBadge count={unreadCount} />}
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
                {notifications.length >= 100 ? "99+" : notifications.length} new
              </Badge>
            </Group>
            <ActionIcon onClick={close}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Menu.Label>

        <ScrollArea.Autosize mah={300} type="scroll">
          {notifications.map((notification) => (
            <Menu.Item>
              <Paper key={notification.id} p="sm" withBorder>
                <Group wrap="nowrap" align="flex-start" gap="sm">
                  <Avatar
                    src={notification.user.avatar}
                    size="md"
                    radius="xl"
                    color="blue"
                  >
                    {notification.user.name[0]}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Group gap={4}>
                      <Text size="sm" fw={600}>
                        {notification.user.name}
                      </Text>
                      {getActionIcon(notification.action)}
                      <Text size="sm" color="dimmed">
                        {notification.action} {notification.target}
                      </Text>
                    </Group>

                    {notification.message && (
                      <Text size="sm" mt={4}>
                        {notification.message}
                      </Text>
                    )}

                    <Text size="xs" c="dimmed" mt={4}>
                      {notification.timestamp}
                    </Text>
                    <Group justify="flex-end">
                      <Button
                        size="xs"
                        leftSection={<IconThumbUpFilled />}
                        variant="light"
                        mt={4}
                      >
                        Mark as read
                      </Button>
                    </Group>
                  </Box>
                </Group>
              </Paper>
            </Menu.Item>
          ))}
        </ScrollArea.Autosize>

        <Menu.Divider />

        <Box px="sm" pb="sm">
          <Button fullWidth variant="light">
            See all incoming activity
          </Button>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationDropdown;

NotificationDropdown.displayName = "NotificationDropdown";
