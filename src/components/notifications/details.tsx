import React, { useState } from "react";
import {
  Card,
  Text,
  Group,
  Avatar,
  Badge,
  Button,
  Modal,
  Divider,
  Image,
  Stack,
} from "@mantine/core";
import { IconHome, IconCash, IconClock } from "@tabler/icons-react";

const NotificationItem = ({
  icon,
  title,
  description,
  time,
  statusColor,
  onViewDetails,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  statusColor?: string;
  attachments?: string[]; // Attachments as an array of image URLs
  onViewDetails: () => void;
}) => (
  <Group
    align="flex-start"
    gap="md"
    px="md"
    py="sm"
    style={{
      backgroundColor: "white",
      borderRadius: 8,
      cursor: "pointer",
    }}
    onClick={onViewDetails}
  >
    <Avatar size={40} radius="xl" color="gray">
      {icon}
    </Avatar>
    <div style={{ flex: 1 }}>
      <Group justify="apart">
        <Text fw={500} size="sm" style={{ flex: 1 }}>
          {title}
        </Text>
        <Text size="xs" color="dimmed">
          {time}
        </Text>
      </Group>
      <Text size="sm" color="dimmed" mt={4}>
        {description}
      </Text>
      {statusColor && (
        <Badge mt="xs" size="sm" color={statusColor} radius="sm">
          Completed
        </Badge>
      )}
    </div>
  </Group>
);

const NotificationDetails = ({
  notification,
  onClose,
}: {
  notification: {
    title: string;
    description: string;
    time: string;
    attachments?: string[];
  };
  onClose: () => void;
}) => (
  <Modal
    opened={!!notification}
    onClose={onClose}
    title={notification?.title || "Notification Details"}
    size="md"
  >
    <Stack gap="sm">
      <Text size="sm" color="dimmed">
        {notification?.time}
      </Text>
      <Text>{notification?.description}</Text>
      <Divider />
      <Text fw={500} size="sm">
        Attachments:
      </Text>
      {notification?.attachments && notification.attachments.length > 0 ? (
        <Stack gap="xs">
          {notification.attachments.map((url, index) => (
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
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </Group>
  </Modal>
);

export default function NotificationDetailsPage() {
  const [selectedNotification, setSelectedNotification] = useState<{
    title: string;
    description: string;
    time: string;
    attachments?: string[];
  } | null>(null);

  const notifications = [
    {
      icon: <IconHome size={18} />,
      title: "Maintenance request update",
      description:
        "The maintenance request for John Doe in Apartment 301 has been completed. The issue was a leaking faucet in the kitchen.",
      time: "5h ago",
      statusColor: "green",
      attachments: [
        "https://cdn.dribbble.com/userupload/15611381/file/original-9cd5f677ae6135b3904d63d823e851fe.png?resize=2048x1536&vertical=center",
      ], // Example attachment
    },
    {
      icon: <IconCash size={18} />,
      title: "Rent Payment Confirmation",
      description:
        "We have received the rent payment of $1,200 for Jane Smith in Apartment 102. The payment was processed successfully.",
      time: "7h ago",
    },
    {
      icon: <IconClock size={18} />,
      title: "Lease Renewal Reminder",
      description:
        "The lease for Esther Howard in Apartment 308 is set to expire on October 15, 2023. Please take appropriate action.",
      time: "7h ago",
      statusColor: "red",
    },
  ];

  return (
    <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: 450 }}>
      <Group gap="apart" mb="md">
        <Text fw={500}>Notifications</Text>
        <Button variant="subtle" size="xs" color="green">
          Mark all as read
        </Button>
      </Group>
      <Divider />
      <Stack gap="xs" mt="md">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            icon={notification.icon}
            title={notification.title}
            description={notification.description}
            time={notification.time}
            statusColor={notification.statusColor}
            attachments={notification.attachments}
            onViewDetails={() => setSelectedNotification(notification)}
          />
        ))}
      </Stack>
      <Divider mt="md" />
      <Text ta="center" mt="md" fw={500} color="blue">
        View all notifications
      </Text>
      {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </Card>
  );
}
