import {
  ActionIcon,
  Avatar,
  Box,
  Button,
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
import { Notification } from "@/types/notifications/notification.types";

const NotificationDetails = ({
  notification,
  opened,
  onClose,
  classes,
}: {
  notification: Notification | null;
  opened: boolean;
  onClose: () => void;
  classes: Record<string, any>;
}) => {
  const theme = useMantineTheme();

  if (!notification) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      padding={0}
      withCloseButton={false}
      centered
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
            <Text className={classes.detailsTitle}>{notification.title}</Text>
            <NotificationBadge type={notification.type} classes={classes} />
          </Group>

          <div className={classes.timestamp}>
            <IconClock size={14} />
            <Text size="sm">
              {notification.timestamp.toLocaleString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </div>

          {notification.sender && (
            <Group gap="xs" mt="sm">
              <Avatar
                src={notification.sender.avatar}
                size="sm"
                color="blue"
                radius="xl"
              >
                {notification.sender.name[0]}
              </Avatar>
              <Text fw={500}>{notification.sender.name}</Text>
            </Group>
          )}
        </Stack>
      </Box>

      <Divider />

      <ScrollArea.Autosize mah={rem(400)}>
        <Box p="xl">
          <div
            className={classes.detailsBody}
            dangerouslySetInnerHTML={{
              __html: notification.body || notification.message,
            }}
          />

          {(notification.imageUrl || notification.videoUrl) && (
            <Box className={classes.mediaContainer} mt="md">
              {notification.imageUrl ? (
                <img
                  src={notification.imageUrl}
                  alt="Content"
                  style={{ width: "100%", borderRadius: theme.radius.md }}
                />
              ) : notification.videoUrl ? (
                <video
                  controls
                  style={{ width: "100%", borderRadius: theme.radius.md }}
                >
                  <source src={notification.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </Box>
          )}
        </Box>
      </ScrollArea.Autosize>

      {notification.actions && notification.actions.length > 0 && (
        <>
          <Divider />
          <Group gap="md" p="md">
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                variant={
                  action.variant === "danger"
                    ? "filled"
                    : action.variant === "primary"
                    ? "filled"
                    : "default"
                }
                color={
                  action.variant === "danger"
                    ? "red"
                    : action.variant === "primary"
                    ? "blue"
                    : undefined
                }
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
              >
                {action.label}
              </Button>
            ))}
          </Group>
        </>
      )}
    </Modal>
  );
};

export default NotificationDetails;
