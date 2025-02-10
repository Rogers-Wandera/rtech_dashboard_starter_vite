import { ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";
import NotificationItem from "../../item/notificationitem";
import { useNotification } from "@/lib/context/notifications/notification";

const UploadNotification = () => {
  const {
    notifications: { uploads },
  } = useNotification();
  return (
    <Tabs.Panel value="uploads" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {uploads.length <= 0 && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No notifications at the moment.
          </Alert>
        )}
        {uploads.length > 0 &&
          uploads.map((upload, index) => {
            return (
              <NotificationItem
                key={index + `${upload.resendId}`}
                data={upload}
                disableOpen
                avatar="https://source.unsplash.com/random/50x50?face"
              />
            );
          })}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UploadNotification;
