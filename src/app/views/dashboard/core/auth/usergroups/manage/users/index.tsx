import {
  TableColumnConfigs,
  TableColumns,
} from "@/components/tables/configs/mrtconfigs/shared.config";
import MRT_NoServerTable from "@/components/tables/mrttables/nonserver/non-servertable";
import { UserGroup, UserGroupMember } from "@/types/app/core/user.type";
import { Avatar, Box } from "@mantine/core";
import femaleAvatar from "@/assets/images/avatars/woman.png";
import maleAvatar from "@/assets/images/avatars/man.png";

type props = {
  group: UserGroup;
};

const tablecols: TableColumns<UserGroupMember>[] = [
  {
    header: "Image",
    accessorKey: "userImage",
    type: "text",
  },
  {
    header: "Name",
    accessorKey: "userName",
    type: "text",
  },
  {
    header: "Gender",
    accessorKey: "gender",
    type: "text",
  },
];
const GroupUsers = ({ group }: props) => {
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
    },
  ];
  return (
    <Box>
      <MRT_NoServerTable
        title="Group User"
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
      />
    </Box>
  );
};

export default GroupUsers;
