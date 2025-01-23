import { Tabs } from "@mantine/core";

const NotificationTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs defaultValue="unread">
      <Tabs.List>
        <Tabs.Tab value="unread">Unread</Tabs.Tab>
        <Tabs.Tab value="all">All</Tabs.Tab>
        <Tabs.Tab value="urgent">Urgent</Tabs.Tab>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export default NotificationTabs;
