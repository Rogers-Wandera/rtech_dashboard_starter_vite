import {
  Card,
  Text,
  Group,
  Avatar,
  ScrollArea,
  Tabs,
  Button,
  ActionIcon,
} from "@mantine/core";
import { IconBell, IconDots } from "@tabler/icons-react";

const NotificationItem = ({
  avatar,
  name,
  time,
  message,
  action,
}: {
  avatar: string;
  name: string;
  time: string;
  message: string;
  action?: JSX.Element;
}) => (
  <Card shadow="md" styles={{ root: { cursor: "pointer" } }}>
    <Group align="start" gap="md" mt="md" mb="md">
      <Avatar src={avatar} radius="xl" size="md" />
      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          {name}
          <Text span c="dimmed" size="xs" ml="xs">
            {time}
          </Text>
        </Text>
      </div>
      {action}
    </Group>
    <Text size="sm" c="dimmed" mt={4}>
      {message}
    </Text>
  </Card>
);

export function Notifications() {
  return (
    <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: 400 }}>
      <Group justify="apart" mb="md">
        <Group>
          <IconBell size={20} />
          <Text fw={500}>Notifications</Text>
        </Group>
        <ActionIcon>
          <IconDots size={18} />
        </ActionIcon>
      </Group>
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="mentions">Mentions</Tabs.Tab>
          <Tabs.Tab value="inbox">Inbox</Tabs.Tab>
          <Tabs.Tab value="archive">Archive</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general" pt="xs">
          <ScrollArea style={{ height: 300 }} scrollbarSize={4}>
            <NotificationItem
              avatar="https://source.unsplash.com/random/50x50?face"
              name="Caitlyn"
              time="2 hours ago"
              message="Shared two files in ConnectBank"
              action={
                <Button size="xs" variant="light">
                  View
                </Button>
              }
            />
            <NotificationItem
              avatar="https://source.unsplash.com/random/50x50?face"
              name="Caitlyn"
              time="2 hours ago"
              message="Shared two files in ConnectBank"
              action={
                <Button size="xs" variant="light">
                  View
                </Button>
              }
            />
            <NotificationItem
              avatar="https://source.unsplash.com/random/50x50?face"
              name="Caitlyn"
              time="2 hours ago"
              message="Shared two files in ConnectBank"
              action={
                <Button size="xs" variant="light">
                  View
                </Button>
              }
            />
            <NotificationItem
              avatar="https://source.unsplash.com/random/50x50?face"
              name="Zaid"
              time="2 hours ago"
              message="Commented on ConnectBank: 'Looks really great. Let me know how it goes.'"
            />
            <NotificationItem
              avatar="https://source.unsplash.com/random/50x50?face"
              name="Marco"
              time="6 hours ago"
              message="Requested access to Surface X"
              action={
                <Group gap="xs">
                  <Button size="xs" variant="light" color="gray">
                    Decline
                  </Button>
                  <Button size="xs">Accept</Button>
                </Group>
              }
            />
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value="mentions" pt="xs">
          <Text size="sm" color="dimmed">
            No mentions yet.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="inbox" pt="xs">
          <Text size="sm" color="dimmed">
            Inbox is empty.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="archive" pt="xs">
          <Text size="sm" color="dimmed">
            Archive is empty.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
