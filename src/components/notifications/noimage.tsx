import React from "react";
import {
  Card,
  Text,
  Group,
  Badge,
  Divider,
  ScrollArea,
  Button,
  Avatar,
} from "@mantine/core";
import { IconHome, IconCash, IconClock } from "@tabler/icons-react";

const NotificationItem = ({
  icon,
  title,
  description,
  time,
  highlight,
  statusColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  highlight?: boolean;
  statusColor?: string;
}) => (
  <Group
    align="flex-start"
    gap="md"
    px="md"
    py="sm"
    style={{
      backgroundColor: highlight ? "#f0f9ff" : "white",
      borderRadius: 8,
    }}
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

export function NotificationWithNoImage() {
  return (
    <Card withBorder shadow="sm" radius="md" p="lg" style={{ width: 450 }}>
      <Group justify="apart" mb="md">
        <Text fw={500}>Notifications</Text>
        <Button variant="subtle" size="xs" color="green">
          Mark all as read
        </Button>
      </Group>
      <Divider />
      <ScrollArea style={{ height: 300 }} scrollbarSize={4} mt="md">
        <Text size="sm" fw={500} color="dimmed" mb="xs">
          Today
        </Text>
        <NotificationItem
          icon={<IconHome size={18} />}
          title="Maintenance request update"
          description="The maintenance request for John Doe in Apartment 301 has been completed. The issue was a leaking faucet in the kitchen."
          time="5h ago"
          statusColor="green"
        />
        <NotificationItem
          icon={<IconCash size={18} />}
          title="Rent Payment Confirmation"
          description="We have received the rent payment of $1,200 for Jane Smith in Apartment 102. The payment was processed successfully."
          time="7h ago"
          highlight
        />
        <NotificationItem
          icon={<IconClock size={18} />}
          title="Lease Renewal Reminder"
          description="The lease for Esther Howard in Apartment 308 is set to expire on October 15, 2023. Please take appropriate action."
          time="7h ago"
          statusColor="red"
        />
      </ScrollArea>
      <Divider mt="md" />
      <Text ta="center" mt="md" fw={500} color="blue">
        View all notifications
      </Text>
    </Card>
  );
}
