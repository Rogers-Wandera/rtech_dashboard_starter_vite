import { Avatar, Group, Text, Card, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NotificationDetails from "../details";
import { SystemNotificationData } from "@/types/notifications/notification.types";
import TruncatedText from "@/components/shared/truncatedtext";

type props = {
  notification: SystemNotificationData;
  action?: JSX.Element;
  avatar: string;
  disableOpen?: boolean;
};
const NotificationItem = ({
  notification,
  action,
  avatar,
  disableOpen = false,
}: props) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (typeof notification.timestamp === "string") {
    notification.timestamp = new Date(notification.timestamp);
  }
  return (
    <Box>
      {!disableOpen && (
        <NotificationDetails
          notification={notification}
          opened={opened}
          close={close}
        />
      )}
      <Card shadow="md" styles={{ root: { cursor: "pointer" } }} onClick={open}>
        <Group align="start" gap="md" mt="md" mb="md">
          <Avatar src={avatar} radius="xl" size="md" />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {notification.title}
              <Text span c="dimmed" size="xs" ml="xs">
                {notification.timestamp.toDateString()}
              </Text>
            </Text>
          </div>
          {action}
        </Group>
        <TruncatedText
          text={notification.message}
          maxLength={100}
          textProps={{ size: "sm", c: "dimmed", mt: 4 }}
        />
      </Card>
    </Box>
  );
};

export default NotificationItem;
