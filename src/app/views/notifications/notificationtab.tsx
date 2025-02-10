import { useNotification } from "@/lib/context/notifications/notification";
import { Badge, Group, Tabs } from "@mantine/core";

const NotificationTabs = ({ children }: { children: React.ReactNode }) => {
  const { counts } = useNotification();
  return (
    <Tabs defaultValue="unread">
      <Tabs.List>
        <Tabs.Tab value="unread">
          <Group>
            Unread <Badge color="red">{counts.unread}</Badge>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="all">
          <Group>
            All <Badge color="red">{counts.all}</Badge>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="urgent">
          <Group>
            Urgent <Badge color="red">{counts.urgent}</Badge>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab value="uploads">
          <Group>
            Uploads <Badge color="red">{counts.uploads}</Badge>
          </Group>
        </Tabs.Tab>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export default NotificationTabs;
