import {
  Group,
  Paper,
  Badge,
  Text,
  Button,
  Avatar,
  Modal,
  Divider,
  Box,
  useMantineTheme,
  rem,
  ActionIcon,
  Stack,
  ScrollArea,
  alpha,
  useMantineColorScheme,
  Tabs,
  Title,
  Flex,
  Card,
  Image,
  TextInput,
  Textarea,
  Select,
  FileInput,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useState, useEffect } from "react";
import {
  IconCheck,
  IconMail,
  IconSend,
  IconAlertCircle,
  IconX,
  IconClock,
  IconCircleCheck,
  IconArrowRight,
  IconPlus,
  IconFilter,
  IconBell,
  IconMessage,
  IconAlertTriangle,
  IconSettings,
  IconPaperclip,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { NotificationType } from "@/types/notifications/notification.enum";
import { notifications_data } from "@/app/views/notifications/notifications_data";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  sender?: {
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  videoUrl?: string;
  body?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
}

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return {
    notificationContainer: {
      display: "flex",
      gap: theme.spacing.md,
      maxWidth: rem(1200),
      margin: "0 auto",
      padding: theme.spacing.md,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexDirection: "column",
      },
    },
    sidebar: {
      width: rem(250),
      flexShrink: 0,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: "100%",
      },
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
    },
    header: {
      paddingBottom: theme.spacing.md,
      borderBottom: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },
    notification: {
      transition: "all 0.2s ease",
      borderLeft: `${rem(4)} solid transparent`,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.md,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: rem(4),
        backgroundColor: "transparent",
        transition: "background-color 0.2s ease",
      },
      "&:hover::before": {
        backgroundColor: theme.colors.blue[5],
      },
    },
    unread: {
      borderLeftColor: theme.colors.blue[6],
      backgroundColor: isDark
        ? alpha(theme.colors.blue[9], 0.2)
        : theme.colors.blue[0],
    },
    read: {
      borderLeftColor: theme.colors.gray[4],
    },
    sent: {
      borderLeftColor: theme.colors.teal[6],
      backgroundColor: isDark
        ? alpha(theme.colors.teal[9], 0.2)
        : theme.colors.teal[0],
    },
    urgent: {
      borderLeftColor: theme.colors.red[6],
      backgroundColor: isDark
        ? alpha(theme.colors.red[9], 0.2)
        : theme.colors.red[0],
    },
    system: {
      borderLeftColor: theme.colors.violet[6],
      backgroundColor: isDark
        ? alpha(theme.colors.violet[9], 0.2)
        : theme.colors.violet[0],
    },
    mediaContainer: {
      position: "relative",
      borderRadius: theme.radius.md,
      overflow: "hidden",
      marginTop: theme.spacing.sm,
      border: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },
    mediaBadge: {
      position: "absolute",
      bottom: theme.spacing.xs,
      right: theme.spacing.xs,
      backdropFilter: "blur(4px)",
      backgroundColor: isDark
        ? alpha(theme.colors.dark[7], 0.7)
        : alpha(theme.colors.gray[0], 0.7),
      color: isDark ? theme.white : theme.black,
      border: `${rem(1)} solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
    timestamp: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.xs,
      color: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
      fontSize: theme.fontSizes.xs,
    },
    detailsTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    closeButton: {
      position: "absolute",
      top: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 10,
    },
    notificationContent: {
      flex: 1,
      minWidth: 0,
    },
    notificationActions: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: "100%",
        justifyContent: "flex-end",
      },
    },
    badgeIcon: {
      marginRight: rem(4),
    },
    detailsBody: {
      lineHeight: 1.6,
      "& p": {
        marginBottom: theme.spacing.sm,
      },
    },
    actionButton: {
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateX(4px)",
      },
    },
    filterCard: {
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
      },
    },
    activeFilter: {
      borderLeft: `${rem(4)} solid ${theme.colors.blue[6]}`,
      backgroundColor: isDark
        ? alpha(theme.colors.blue[9], 0.3)
        : theme.colors.blue[1],
    },
    filterIcon: {
      marginRight: theme.spacing.sm,
    },
    emptyState: {
      textAlign: "center",
      padding: theme.spacing.xl,
      color: isDark ? theme.colors.dark[3] : theme.colors.gray[6],
    },
    createButton: {
      marginBottom: theme.spacing.md,
    },
    formContainer: {
      padding: theme.spacing.md,
    },
  };
});

const NotificationBadge = ({ type }: { type: NotificationType }) => {
  const { classes } = useStyles();

  const getIcon = () => {
    switch (type) {
      case "unread":
        return <IconMail size={14} className={classes.badgeIcon} />;
      case "sent":
        return <IconSend size={14} className={classes.badgeIcon} />;
      case "urgent":
        return <IconAlertCircle size={14} className={classes.badgeIcon} />;
      case "system":
        return <IconCircleCheck size={14} className={classes.badgeIcon} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case "unread":
        return "blue";
      case "sent":
        return "teal";
      case "urgent":
        return "red";
      case "system":
        return "violet";
      default:
        return "gray";
    }
  };

  return (
    <Badge
      size="sm"
      variant="light"
      color={getColor()}
      leftSection={getIcon()}
      radius="sm"
    >
      {type}
    </Badge>
  );
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        p="md"
        mb="sm"
        className={cx(classes.notification, classes[notification.type])}
        radius="md"
      >
        <Group align="flex-start" wrap="nowrap">
          {notification.sender && (
            <Avatar
              src={notification.sender.avatar}
              size="md"
              color="blue"
              radius="xl"
            >
              {notification.sender.name[0]}
            </Avatar>
          )}

          <div className={classes.notificationContent}>
            <Group justify="space-between" gap="xs" wrap="nowrap">
              <Text fw={600} lineClamp={1}>
                {notification.title}
              </Text>
              <NotificationBadge type={notification.type} />
            </Group>

            <Text size="sm" lineClamp={2} mt={4}>
              {notification.message}
            </Text>

            {notification.imageUrl && (
              <Box className={classes.mediaContainer} mt="sm">
                <img
                  src={notification.imageUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: rem(120),
                    objectFit: "cover",
                  }}
                />
                <Badge className={classes.mediaBadge} size="xs">
                  Image
                </Badge>
              </Box>
            )}

            <Group justify="space-between" mt="sm">
              <div className={classes.timestamp}>
                <IconClock size={14} />
                <Text size="xs">{formatTime(notification.timestamp)}</Text>
              </div>

              {notification.type === "unread" && (
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={<IconArrowRight size={14} />}
                  className={classes.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  Mark as read
                </Button>
              )}
            </Group>
          </div>
        </Group>
      </Paper>
    </motion.div>
  );
};

const NotificationDetails = ({
  notification,
  opened,
  onClose,
}: {
  notification: Notification | null;
  opened: boolean;
  onClose: () => void;
}) => {
  const { classes } = useStyles();
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
            <NotificationBadge type={notification.type} />
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

const NotificationFilterCard = ({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => {
  const { classes, cx } = useStyles();

  return (
    <Card
      withBorder
      p="sm"
      mb="sm"
      className={cx(classes.filterCard, { [classes.activeFilter]: active })}
      onClick={onClick}
    >
      <Group>
        <Box className={classes.filterIcon}>{icon}</Box>
        <Text fw={500}>{label}</Text>
        <Badge ml="auto" variant="light" color={active ? "blue" : "gray"}>
          {count}
        </Badge>
      </Group>
    </Card>
  );
};

const CreateNotificationForm = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (notification: Notification) => void;
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("unread");
  const [senderName, setSenderName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: new Date(),
      sender: senderName ? { name: senderName } : undefined,
      imageUrl: previewUrl || undefined,
      body: `<p>${message}</p>`,
    };

    onCreate(newNotification);
    onClose();
  };

  return (
    <Box>
      <Title order={3} mb="md">
        Create New Notification
      </Title>
      <Stack>
        <TextInput
          label="Title"
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Message"
          placeholder="Notification message"
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          required
          minRows={3}
        />
        <Select
          label="Type"
          placeholder="Select type"
          value={type}
          onChange={(value) => setType(value as NotificationType)}
          data={[
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
            { value: "sent", label: "Sent" },
            { value: "urgent", label: "Urgent" },
            { value: "system", label: "System" },
          ]}
          required
        />
        <TextInput
          label="Sender Name (optional)"
          placeholder="John Doe"
          value={senderName}
          onChange={(e) => setSenderName(e.currentTarget.value)}
        />
        <FileInput
          label="Image (optional)"
          placeholder="Select image"
          accept="image/*"
          value={image}
          onChange={handleImageChange}
          leftSection={<IconPaperclip size={14} />}
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            width={200}
            height={120}
            fit="cover"
            radius="sm"
          />
        )}
        <Group justify="right" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !message}>
            Create
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

const NotificationSystem = () => {
  const { classes } = useStyles();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">(
    "all"
  );
  const [createModalOpen, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Sample notifications data
  useEffect(() => {
    setNotifications(notifications_data);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, type: "read" as NotificationType } : n
      )
    );
  };

  const handleOpenDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);

    // Auto-mark as read when opened
    if (notification.type === "unread") {
      handleMarkAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => n.type === "unread").length;
  const urgentCount = notifications.filter((n) => n.type === "urgent").length;
  const sentCount = notifications.filter((n) => n.type === "sent").length;
  const systemCount = notifications.filter((n) => n.type === "system").length;
  const readCount = notifications.filter((n) => n.type === "read").length;

  const handleCreateNotification = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
  };

  return (
    <div className={classes.notificationContainer}>
      <div className={classes.sidebar}>
        <Button
          fullWidth
          leftSection={<IconPlus size={16} />}
          className={classes.createButton}
          onClick={openCreateModal}
        >
          Create Notification
        </Button>

        <Card withBorder p="md" mb="md">
          <Text fw={500} mb="sm" display="flex" ta="center">
            <IconFilter size={16} style={{ marginRight: "8px" }} />
            Filter Notifications
          </Text>
          <NotificationFilterCard
            icon={<IconBell size={18} />}
            label="All"
            count={notifications.length}
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          <NotificationFilterCard
            icon={<IconMail size={18} />}
            label="Unread"
            count={unreadCount}
            active={activeFilter === "unread"}
            onClick={() => setActiveFilter("unread")}
          />
          <NotificationFilterCard
            icon={<IconAlertTriangle size={18} />}
            label="Urgent"
            count={urgentCount}
            active={activeFilter === "urgent"}
            onClick={() => setActiveFilter("urgent")}
          />
          <NotificationFilterCard
            icon={<IconSend size={18} />}
            label="Sent"
            count={sentCount}
            active={activeFilter === "sent"}
            onClick={() => setActiveFilter("sent")}
          />
          <NotificationFilterCard
            icon={<IconSettings size={18} />}
            label="System"
            count={systemCount}
            active={activeFilter === "system"}
            onClick={() => setActiveFilter("system")}
          />
          <NotificationFilterCard
            icon={<IconMessage size={18} />}
            label="Read"
            count={readCount}
            active={activeFilter === "read"}
            onClick={() => setActiveFilter("read")}
          />
        </Card>
      </div>

      <div className={classes.mainContent}>
        <Box className={classes.header}>
          <Group justify="apart">
            <Text size="xl" fw={700}>
              {activeFilter === "all"
                ? "All Notifications"
                : `${
                    activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)
                  } Notifications`}
            </Text>
            <Badge
              variant="filled"
              size="lg"
              color={unreadCount > 0 ? "blue" : "gray"}
            >
              {filteredNotifications.length} shown
            </Badge>
          </Group>
        </Box>

        <Box mt="md">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleOpenDetails(notification)}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>
              ))
            ) : (
              <Box className={classes.emptyState}>
                <Text size="lg" mb="sm">
                  No notifications found
                </Text>
                <Text color="dimmed">
                  {activeFilter === "all"
                    ? "You don't have any notifications yet."
                    : `You don't have any ${activeFilter} notifications.`}
                </Text>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </div>

      <NotificationDetails
        notification={selectedNotification}
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      <Modal
        opened={createModalOpen}
        onClose={closeCreateModal}
        title="Create New Notification"
        size="lg"
      >
        <CreateNotificationForm
          onClose={closeCreateModal}
          onCreate={handleCreateNotification}
        />
      </Modal>
    </div>
  );
};

export default NotificationSystem;

NotificationSystem.displayName = "NotificationSystem";
