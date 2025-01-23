import { ScrollArea, Tabs } from "@mantine/core";
import { Alert, AlertTitle } from "@mui/material";

const UrgentNotifications = () => {
  return (
    <Tabs.Panel value="urgent" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          No notifications at the moment.
        </Alert>
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UrgentNotifications;
