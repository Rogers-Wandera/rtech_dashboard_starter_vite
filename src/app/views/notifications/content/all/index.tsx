import { ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";
import NotificationItem from "../../item/notificationitem";
import { useNotification } from "@/lib/context/notifications/notification";

const AllNotifications = () => {
  const { notifications } = useNotification();
  return (
    <Tabs.Panel value="all" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {notifications.all.length <= 0 && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No notifications at the moment.
          </Alert>
        )}
        {notifications.all.map((item, index) => (
          <NotificationItem
            key={item.id + index}
            data={item}
            avatar="https://source.unsplash.com/random/50x50?face"
          />
        ))}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default AllNotifications;
