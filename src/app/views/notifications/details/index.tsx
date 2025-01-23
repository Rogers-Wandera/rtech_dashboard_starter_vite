import { SystemNotificationData } from "@/types/notifications/notification.types";
import {
  Button,
  Divider,
  Group,
  Image,
  Modal,
  Stack,
  Text,
} from "@mantine/core";

type props = {
  notification: SystemNotificationData;
  opened: boolean;
  close: () => void;
};

const NotificationDetails = ({ notification, close, opened }: props) => (
  <Modal
    opened={opened}
    onClose={close}
    title={notification?.title || "Notification Details"}
    size="md"
    zIndex={1000}
  >
    <Stack gap="sm">
      <Text size="sm" color="dimmed">
        {notification.timestamp.toDateString()}
      </Text>
      <Text>{notification.message}</Text>
      <Divider />
      <Text fw={500} size="sm">
        Attachments:
      </Text>
      {notification?.mediaUrl && notification?.mediaUrl.length > 0 ? (
        <Stack gap="xs">
          {notification.mediaUrl.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Attachment ${index + 1}`}
              radius="md"
              w={200}
            />
          ))}
        </Stack>
      ) : (
        <Text size="sm" color="dimmed">
          No attachments available.
        </Text>
      )}
    </Stack>
    <Group gap="right" mt="md">
      <Button variant="outline" onClick={close}>
        Close
      </Button>
    </Group>
  </Modal>
);
export default NotificationDetails;
