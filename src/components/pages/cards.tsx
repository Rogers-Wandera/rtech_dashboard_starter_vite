import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPointFilled,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Text,
  Title,
  Menu,
  rem,
} from "@mantine/core";

const avatars = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
];

export function TaskCard() {
  return (
    <Card withBorder padding="lg" radius="md" style={{ cursor: "pointer" }}>
      <Group justify="space-between">
        <Title order={3}>Sales Group</Title>
        <Badge size="sm" leftSection={<IconPointFilled />} color="lime.4">
          Active
        </Badge>
      </Group>

      <Group pt={20}>
        <Avatar size="lg" src={avatars[0]} alt="supervisor" />
        <Flex direction="column">
          <Title order={4}>Rogers Wandera</Title>
          <Text>Supervisor</Text>
        </Flex>
      </Group>
      <Text fz="sm" c="dimmed" mt={5}>
        This is the group of the business sales team
      </Text>

      <Group justify="space-between" mt="md">
        <Avatar.Group spacing="sm">
          <Avatar src={avatars[0]} radius="xl" />
          <Avatar src={avatars[1]} radius="xl" />
          <Avatar src={avatars[2]} radius="xl" />
          <Avatar radius="xl">+5</Avatar>
        </Avatar.Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="default" size="lg" radius="md">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
            >
              View
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconEdit style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Edit
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
}
