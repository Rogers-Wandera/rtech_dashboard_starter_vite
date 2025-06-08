import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Modal,
  rem,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconClock, IconX } from "@tabler/icons-react";
import NotificationBadge from "../badge";
import {
  NotificationEntity,
  NotificationRecipient,
} from "@/types/server/notifications/entity.types";
import { AlertType } from "@/types/server/notifications/notification.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FallbackAvatar from "@/assets/images/avatars/01.png";
import TruncatedHtml from "@/components/shared/truncatedHtml";
import { Button } from "@mantine/core";

dayjs.extend(relativeTime);

const NotificationDetails = ({
  item,
  opened,
  onClose,
  classes,
}: {
  item: NotificationRecipient | NotificationEntity | null;
  opened: boolean;
  onClose: () => void;
  classes: Record<string, any>;
}) => {
  const theme = useMantineTheme();

  if (!item) return null;

  const getTimeStamp = (timestamp: string) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    return date.from(now);
  };

  const notification = "notification" in item ? item.notification : item;
  const hasRead = "readStatus" in item && item.readStatus === "unread";

  const { data } = notification;

  const getType = () => {
    if ("readStatus" in item && data?.alertType === AlertType.CUSTOM) {
      if (item.readStatus === "read") {
        return "read";
      } else if (item.readStatus === "unread" && item.priority === "high") {
        return "urgent";
      } else if (item.readStatus === "unread") {
        return "unread";
      }
    } else if (
      data?.alertType === AlertType.ANNOUCEMENT ||
      data?.alertType === AlertType.SYSTEM
    ) {
      return "system";
    } else if (data?.alertType === AlertType.MAINTENANCE) {
      return "urgent";
    } else {
      return "none";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      padding={0}
      withCloseButton={false}
      centered
      zIndex={1000}
      radius="md"
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
    >
      <ActionIcon
        className={classes.closeButton}
        variant="light"
        color="gray"
        size="lg"
        radius="xl"
        onClick={onClose}
      >
        <IconX size={20} />
      </ActionIcon>

      <Box p="xl" pb="md">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Text className={classes.detailsTitle}>{data.subject}</Text>
            <NotificationBadge type={getType() || "none"} classes={classes} />
          </Group>

          <div className={classes.timestamp}>
            <IconClock size={14} />
            <Text size="sm">{getTimeStamp(String(item.creationDate))}</Text>
          </div>

          {data?.avatar && (
            <Group gap="xs" mt="sm">
              <Avatar
                src={data.avatar.avatar || data.avatar.name.charAt(0)}
                size="sm"
                color="blue"
                radius="xl"
              >
                {data.avatar.name}
              </Avatar>
              <Text fw={500}> {data.avatar.name}</Text>
            </Group>
          )}
          {!data?.avatar && (
            <Group gap="xs" mt="sm">
              <Avatar src={FallbackAvatar} size="md" radius="xl" color="blue">
                {data.channel}
              </Avatar>
              <Text fw={500}> {data.alertType}</Text>
            </Group>
          )}
        </Stack>
      </Box>

      <Divider />

      <ScrollArea.Autosize mah={rem(400)}>
        <Box p="xl">
          <TruncatedHtml
            html={data.body}
            textProps={{ className: classes.detailsBody }}
          />

          {data.channel === "push" &&
            data.provider === "socket" &&
            data?.coverImage && (
              <Box className={classes.mediaContainer} mt="md">
                <img
                  src={data.coverImage}
                  alt={data.subject}
                  style={{ width: "100%", borderRadius: theme.radius.md }}
                />
              </Box>
            )}
        </Box>
      </ScrollArea.Autosize>

      {hasRead && (
        <>
          <Divider />
          <Group gap="md" p="md">
            <Button variant={"default"} color={"blue"} onClick={() => {}}>
              Mark as read
            </Button>
          </Group>
        </>
      )}
    </Modal>
  );
};

export default NotificationDetails;
