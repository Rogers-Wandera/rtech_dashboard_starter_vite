import { useAuth } from "@/hooks/auth/auth.hooks";
import { useSocket } from "@/lib/context/services/socket";
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPES,
} from "@/types/notifications/notification.enum";
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
import { useEffect } from "react";

type props = {
  notification: SystemNotificationData;
  opened: boolean;
  close: () => void;
  status: NOTIFICATION_STATUS;
  id?: string;
};

const NotificationDetails = ({
  notification,
  close,
  opened,
  status,
  id = undefined,
}: props) => {
  const socket = useSocket();
  const { user } = useAuth();
  useEffect(() => {
    if (
      opened &&
      id &&
      socket?.socket &&
      user &&
      status != NOTIFICATION_STATUS.READ
    ) {
      socket.socket.emit(NOTIFICATION_TYPES.UPDATE_READ, {
        id,
        userId: user.id,
      });
    }
    return () => {
      socket?.socket?.off(NOTIFICATION_TYPES.UPDATE_READ);
    };
  }, [opened]);
  return (
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
};
export default NotificationDetails;
