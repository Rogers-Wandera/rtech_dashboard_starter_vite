import { RootState } from "@/lib/store/store";
import { Badge, Group, Tabs } from "@mantine/core";
import { useSelector } from "react-redux";

const NotificationTabs = ({ children }: { children: React.ReactNode }) => {
  const uploads = useSelector(
    (state: RootState) => state.appState.notification.uploads
  );

  return (
    <Tabs defaultValue="unread">
      <Tabs.List>
        <Tabs.Tab value="unread">Unread</Tabs.Tab>
        <Tabs.Tab value="all">All</Tabs.Tab>
        <Tabs.Tab value="urgent">Urgent</Tabs.Tab>
        <Tabs.Tab value="uploads">
          <Group>
            Uploads <Badge color="red">{uploads.count}</Badge>
          </Group>
        </Tabs.Tab>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export default NotificationTabs;
