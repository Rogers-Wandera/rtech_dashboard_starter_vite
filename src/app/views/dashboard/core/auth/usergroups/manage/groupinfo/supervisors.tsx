import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/shared.config";
import MRT_NoServerTable from "@/components/tables/mrttables/nonserver/non-servertable";
import {
  User,
  UserGroup,
  UserGroupSupervisors,
} from "@/types/app/core/user.type";
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
import ServerCombo from "@/components/shared/serversidecombo/servercombo";
import { useState } from "react";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import ConfirmModal from "@/components/shared/dialogs/confirm";
import { MRT_Row } from "material-react-table";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { useAppDispatch } from "@/hooks/store.hooks";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { notifier } from "@/lib/utils/notify/notification";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";

type props = {
  group: UserGroup;
  refetch: () => void;
};
const GroupSupervisors = ({ group, refetch }: props) => {
  const [userId, setUserId] = useState<string | null>(null);

  const { postAsync } = useMutateData({
    queryKey: "mark-remove-main-supervisor",
  });
  const dispatch = useAppDispatch();
  const {
    validation: { validationErrors },
  } = useMRTTableContext<UserGroupSupervisors>();
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
      Edit: () => null,
    },
    {
      accessorKey: "isMain",
      Cell: ({ row }) => {
        const display = row.original.isMain === 1 ? "Yes" : "No";
        return display;
      },
      Edit: () => null,
    },
    {
      accessorKey: "userId",
      Cell: ({ row }) => row.original.userName,
      Edit: ({ column, row }) => {
        return (
          <ServerCombo<User>
            endPoint="core/auth/users"
            label="User"
            textKey="userName"
            valueKey="id"
            zIndex={10000}
            value={userId}
            formatData={(data) => {
              const filter = data.filter((item) => {
                return !group.supervisor.some(
                  (member) => member.userId === item.value
                );
              });
              return filter;
            }}
            otherOptions={{
              onChange: (event) => {
                row._valuesCache[column.id] = event;
                setUserId(event);
              },
              error: validationErrors["userId"],
            }}
          />
        );
      },
    },
  ];
  const mainsupervisor = group.supervisor.find(
    (supervisor) => supervisor.isMain === 1
  );

  const HandleMarkRemoveMain = async (row: MRT_Row<UserGroupSupervisors>) => {
    return ConfirmModal({
      message: `Are you sure you want to ${
        row.original.isMain === 1 ? "remove" : "mark"
      } ${row.original.userName} as main supervisor?`,
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const response = await postAsync({
            endPoint: "core/auth/groupsupervisors/main",
            payload: {
              userId: row.original.userId,
              groupId: group.id,
            },
            method: USE_MUTATE_METHODS.PATCH,
          });
          notifier.success({ message: String(response.msg) });
          refetch();
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };
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
        refetch={refetch}
        tablecolumns={[
          { accessorKey: "userImage", header: "Image", type: "text" },
          { accessorKey: "userId", header: "Name", type: "text" },
          { accessorKey: "isMain", header: "Main", type: "text" },
        ]}
        menuitems={[
          {
            label: (row) =>
              (row?.original.isMain == 1 ? "Remove" : `Mark`) +
              ` ${row.original.userName} as Main`,
            icon: (row) =>
              row?.original.isMain == 0 ? (
                <IconCircleCheckFilled />
              ) : (
                <IconCircleXFilled />
              ),
            onClick: (row) => HandleMarkRemoveMain(row),
          },
        ]}
        title="Supervisor"
        columnConfigs={configs}
        otherTableOptions={{
          enableHiding: false,
          enableDensityToggle: false,
          enableFullScreenToggle: false,
        }}
        enableRowActions={true}
        rowactions={{
          editrender: false,
          deleterender: true,
          deleteText: (row) => `Remove ${row.original.userName}`,
          actiontype: "menu",
        }}
        serveractions={{
          deleteEndPoint: "core/auth/groupsupervisors",
          addEndPoint: "core/auth/groupsupervisors",
          postFields: ["userId"],
          addCreateCallback: (values) => {
            return { groupId: group.id, userId: values.userId };
          },
        }}
      />
    </Box>
  );
};

export default GroupSupervisors;
