import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import MRT_NoServerTable from "@/components/tables/mrttables/non-servertable";
import { UserGroup, UserGroupSupervisors } from "@/types/app/core/user.type";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Text,
  Title,
} from "@mantine/core";
import femaleAvatar from "@/assets/images/avatars/woman.png";
import maleAvatar from "@/assets/images/avatars/man.png";

type props = {
  group: UserGroup;
};
const GroupSupervisors = ({ group }: props) => {
  const configs: TableColumnConfigs<UserGroupSupervisors>[] = [
    {
      accessorKey: "userImage",
      Cell: ({ row }) => {
        const gender = row.original.gender;
        let image = gender === "Male" ? maleAvatar : femaleAvatar;
        if (row.original.userImage) {
          image = row.original.userImage;
        }
        return <Avatar alt={row.original.userName} src={image} />;
      },
    },
  ];
  const mainsupervisor = group.supervisor.find(
    (supervisor) => supervisor.isMain === 1
  );
  return (
    <Box>
      <Card mb={"md"}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Main Supervisor
          </Text>
          <Badge>{mainsupervisor ? mainsupervisor.userName : "None"}</Badge>
        </Group>
        <Divider mb={10} mt={20} />
        <Title order={4}>Supervisors</Title>
      </Card>
      <MRT_NoServerTable
        data={group.supervisor}
        tablecolumns={[
          { accessorKey: "userImage", header: "Image", type: "text" },
          { accessorKey: "userName", header: "Name", type: "text" },
          { accessorKey: "isMain", header: "Main", type: "text" },
        ]}
        title="Group"
        columnConfigs={configs}
        otherTableOptions={{
          enableHiding: false,
          enableDensityToggle: false,
          enableFullScreenToggle: false,
        }}
      />
    </Box>
  );
};

export default GroupSupervisors;
