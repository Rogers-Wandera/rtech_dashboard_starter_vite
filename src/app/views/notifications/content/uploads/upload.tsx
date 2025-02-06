import { RootState } from "@/lib/store/store";
import { ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";
import { useSelector } from "react-redux";
import NotificationItem from "../../item/notificationitem";

const UploadNotification = () => {
  const notifications = useSelector(
    (state: RootState) => state.appState.notification.uploads
  );
  return (
    <Tabs.Panel value="uploads" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {notifications?.data?.length <= 0 && (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No notifications at the moment.
          </Alert>
        )}
        {notifications?.data?.length > 0 &&
          notifications?.data.map((upload) => {
            return (
              <NotificationItem
                notification={{
                  message: upload.message,
                  title: upload.title,
                  timestamp: upload.date,
                }}
                avatar="https://source.unsplash.com/random/50x50?face"
              />
            );
          })}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UploadNotification;
