import { RootState } from "@/lib/store/store";
import { Button, ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";
import { useSelector } from "react-redux";
import NotificationItem from "../../item/notificationitem";
import { useNotification } from "@/lib/context/notifications/notification";

const UploadNotification = () => {
  // const notifications = useSelector(
  //   (state: RootState) => state.appState.notification.uploads
  // );
  const { uploads } = useNotification();
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
                key={index}
                notification={{
                  message: upload.data.message,
                  title: upload.data.title,
                  timestamp: upload.data.timestamp,
                }}
                disableOpen
                avatar="https://source.unsplash.com/random/50x50?face"
                // action={
                //   !upload?. ? (
                //     <Button size="xs" variant="light">
                //       Mark as Read
                //     </Button>
                //   ) : undefined
                // }
              />
            );
          })}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UploadNotification;
