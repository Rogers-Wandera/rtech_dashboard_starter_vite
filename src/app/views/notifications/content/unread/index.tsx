import { ScrollArea, Tabs } from "@mantine/core";
import NotificationItem from "../../item/notificationitem";
import { data } from "./data";

const UnreadNotifications = () => {
  return (
    <Tabs.Panel value="unread" pt="xs">
      <ScrollArea style={{ height: 200 }} scrollbarSize={4}>
        {data.map((item) => (
          <NotificationItem
            notification={item}
            avatar="https://source.unsplash.com/random/50x50?face"
          />
        ))}
      </ScrollArea>
    </Tabs.Panel>
  );
};

export default UnreadNotifications;
