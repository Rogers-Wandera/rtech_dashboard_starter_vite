import { ScrollArea, Tabs } from "@mantine/core";
import NotificationItem from "../../item/notificationitem";
import { useNotification } from "@/lib/context/notifications/notification";
import { AlertTitle, Alert } from "@mui/material";

const UnreadNotifications = () => {
  const { notifications } = useNotification();
  return (
    <Tabs.Panel value="unread" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {notifications.unread.length <= 0 && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No unread notifications at the moment.
          </Alert>
        )}
        {notifications.unread.map((item, index) => (
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

export default UnreadNotifications;
