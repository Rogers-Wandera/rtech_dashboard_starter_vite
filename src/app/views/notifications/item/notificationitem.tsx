import { Avatar, Group, Text, Card, Box, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NotificationDetails from "../details";
import { SystemNotification } from "@/types/notifications/notification.types";
import TruncatedText from "@/components/shared/truncatedtext";
import {
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPES,
} from "@/types/notifications/notification.enum";
import { useSocket } from "@/lib/context/services/socket";
import { useAuth } from "@/hooks/auth/auth.hooks";

type props = {
  action?: JSX.Element;
  avatar: string;
  disableOpen?: boolean;
  data: SystemNotification;
};
const NotificationItem = ({
  data,
  action,
  avatar,
  disableOpen = false,
}: props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const socket = useSocket();
  const { user } = useAuth();

  if (typeof data.data.timestamp === "string") {
    data.data.timestamp = new Date(data.data.timestamp);
  }

  const HandleUnread = () => {
    if (user && socket?.socket && data?.id) {
      socket.socket.emit(NOTIFICATION_TYPES.UPDATE_READ, {
        id: data.id,
        userId: user.id,
      });
    }
  };
  return (
    <Box>
      {!disableOpen && (
        <NotificationDetails
          notification={data.data}
          opened={opened}
          close={close}
          id={data?.id}
          status={data?.status}
        />
      )}
      <Card
        shadow="lg"
        mb={10}
        withBorder
        styles={{ root: { cursor: "pointer" } }}
        onClick={open}
      >
        <Group align="start" gap="md" mt="md" mb="md">
          <Avatar src={avatar} radius="xl" size="md" />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {data.data.title}
              <Text span c="dimmed" size="xs" ml="xs">
                {data.data.timestamp.toDateString()}
              </Text>
            </Text>
          </div>
          {!action &&
            disableOpen &&
            data?.status != NOTIFICATION_STATUS.READ && (
              <Button size="xs" variant="light" onClick={HandleUnread}>
                Mark as Read
              </Button>
            )}
        </Group>
        <TruncatedText
          text={data.data.message}
          maxLength={100}
          textProps={{ size: "sm", c: "dimmed", mt: 4 }}
        />
      </Card>
    </Box>
  );
};

export default NotificationItem;
