import { ActionIcon, Card, Group, Text } from "@mantine/core";
import NotificationTabs from "./notificationtab";
import UnreadNotifications from "./content/unread";
import { IconBell, IconDots } from "@tabler/icons-react";
import AllNotifications from "./content/all";
import UrgentNotifications from "./content/urgent";

const NotificationsPage = () => {
  return (
    <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: 400 }}>
      <Group
        className="py-3 card-header d-flex justify-content-between bg-primary"
        justify="apart"
        mb="md"
      >
        <Group>
          <IconBell color="white" size={20} />
          <Text className="mb-0 text-white" fw={500}>
            Notifications
          </Text>
        </Group>
        <ActionIcon>
          <IconDots color="white" size={18} />
        </ActionIcon>
      </Group>
      <NotificationTabs>
        <UnreadNotifications />
        <AllNotifications />
        <UrgentNotifications />
      </NotificationTabs>
    </Card>
  );
};

export default NotificationsPage;
