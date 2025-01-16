import {
  TableColumnConfigs,
  TableColumns,
} from "@/components/tables/configs/mrtconfigs/shared.config";
import MRT_NoServerTable from "@/components/tables/mrttables/nonserver/non-servertable";
import { User, UserGroup, UserGroupMember } from "@/types/app/core/user.type";
import { Avatar, Box } from "@mantine/core";
import femaleAvatar from "@/assets/images/avatars/woman.png";
import maleAvatar from "@/assets/images/avatars/man.png";
import ServerCombo from "@/components/shared/serversidecombo/servercombo";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { validateRequired } from "@/lib/utils/helpers/utilfuncs";
import { useState } from "react";

type props = {
  group: UserGroup;
  refetch: () => void;
};

const tablecols: TableColumns<UserGroupMember>[] = [
  {
    header: "Image",
    accessorKey: "userImage",
    type: "text",
  },
  {
    header: "Name",
    accessorKey: "userId",
    type: "text",
  },
  {
    header: "Gender",
    accessorKey: "gender",
    type: "text",
  },
];

function validateData(data: UserGroupMember) {
  return {
    userId: !validateRequired(data.userId as string)
      ? "Please select a user"
      : "",
  };
}
const GroupUsers = ({ group, refetch }: props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const {
    validation: { validationErrors },
  } = useMRTTableContext<UserGroupMember>();

  const moreTableCols: TableColumnConfigs<UserGroupMember>[] = [
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
                return !group.members.some(
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
    {
      accessorKey: "gender",
      Edit: () => null,
    },
  ];
  return (
    <Box>
      <MRT_NoServerTable
        title="Group User"
        refetch={refetch}
        data={group.members}
        tablecolumns={tablecols}
        enableRowSelection={true}
        columnConfigs={moreTableCols}
        enableRowActions={true}
        rowactions={{
          editrender: false,
          deleterender: true,
          deleteText: (row) => `Remove ${row.original.userName}`,
          actiontype: "menu",
        }}
        otherTableOptions={{
          enableHiding: false,
          enableDensityToggle: false,
          enableFullScreenToggle: false,
        }}
        serveractions={{
          deleteEndPoint: "core/auth/usergroupmembers",
          addEndPoint: "core/auth/usergroupmembers/" + group.id,
          postFields: ["userId"],
        }}
        validateData={validateData}
      />
    </Box>
  );
};

export default GroupUsers;
