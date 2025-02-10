import { useNotification } from "@/lib/context/notifications/notification";
import { ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";
import NotificationItem from "../../item/notificationitem";

const UrgentNotifications = () => {
  const {
    notifications: { urgent },
  } = useNotification();
  return (
    <Tabs.Panel value="urgent" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {urgent.length <= 0 && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No notifications at the moment.
          </Alert>
        )}
        {urgent.length > 0 &&
          urgent.map((upload, index) => {
            return (
              <NotificationItem
                data={upload}
                key={index + `${upload.resendId}`}
                avatar="https://source.unsplash.com/random/50x50?face"
              />
            );
          })}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UrgentNotifications;
