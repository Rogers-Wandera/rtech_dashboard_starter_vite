import { UserGroup } from "@/types/app/core/user.type";
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconUser, IconUsers } from "@tabler/icons-react";
import GroupModal from "../../modals/groupmodal";
import { useState } from "react";
import TruncatedText from "@/components/shared/truncatedtext";
import GroupSupervisors from "./supervisors";

type props = {
  group: UserGroup;
  refetch: () => void;
};

function GroupInfo({ group, refetch }: props) {
  const [opened, { close, open }] = useDisclosure();
  const [usergroup, setUserGroup] = useState<UserGroup | null>(null);

  return (
    <Container my="md">
      <GroupModal
        opened={opened}
        close={close}
        group={usergroup}
        setGroup={setUserGroup}
        refetch={refetch}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <GroupSupervisors group={group} refetch={refetch} />
        <Grid gutter="md">
          <Grid.Col>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{group.groupName}</Text>
                <Badge color={group.status === "active" ? "green" : "pink"}>
                  {group.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </Group>

              <TruncatedText text={group.description} />

              <Button
                leftSection={<IconEdit />}
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  setUserGroup(group);
                  open();
                }}
              >
                Update
              </Button>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Supervisors
                </Text>
                <IconUser size={22} stroke={1.5} />
              </Group>
              <Group align="center" gap="xs" mt={25}>
                <Text>{group.supervisor.length}</Text>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Users
                </Text>
                <IconUsers size={22} stroke={1.5} />
              </Group>
              <Group align="center" gap="xs" mt={25}>
                <Text>{group.members.length}</Text>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
}

export default GroupInfo;
