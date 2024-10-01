import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import { MRT_ServerTable } from "@/components/tables/mrttables/mrtserverside";
import RouteRoles from "@/hocs/verifyroles";
import { useAuth } from "@/hooks/auth.hooks";
import { useMRTPaginateTable } from "@/hooks/usefetch.hook";
import { User } from "@/types/app/core/user.type";
import { PaginateResponse } from "@/types/server/server.main.types";
import { usermenuitems, userscolumns } from "./userconfig";
import MaleImage from "@/assets/images/avatars/01.png";
import FemaleImage from "@/assets/images/avatars/lady.png";
import { Avatar } from "@mui/material";

const ManageUsers = () => {
  const { user } = useAuth();
  const moretableconfigs: TableColumnConfigs<User>[] = [
    { accessorKey: "gender", filterSelectOptions: ["Male", "Female"] },
    {
      accessorKey: "image",
      Edit: () => null,
      Cell: ({ row }) => {
        const fallbackimage =
          row.original.gender === "Male" ? MaleImage : FemaleImage;
        const image = row.original.image ? row.original.image : fallbackimage;
        return <Avatar alt={user?.displayName} src={image} />;
      },
    },
    {
      accessorKey: "last_active",
      Edit: () => null,
      Cell: ({ row }) => {
        const display =
          row.original.last_active <= 0
            ? "Today"
            : row.original.last_active > 1
            ? `${row.original.last_active} days ago`
            : `${row.original.last_active} day ago`;
        return display;
      },
    },
  ];

  const { refetch } = useMRTPaginateTable<PaginateResponse<User>>({
    queryKey: "users",
    endPoint: "core/auth/user",
  });

  return (
    <div>
      <MRT_ServerTable<User>
        tablecolumns={userscolumns}
        columnConfigs={moretableconfigs}
        refetch={refetch}
        title="User"
        enableEditing={true}
        rowactions={{
          editrender: (row) =>
            row.original.id === user?.id
              ? false
              : row.original.isLocked === 1
              ? false
              : true,
          deleterender: (row) => (row.original.id === user?.id ? false : true),
          actiontype: "menu",
        }}
        menuitems={[...usermenuitems(user)]}
      />
    </div>
  );
};

export default RouteRoles(ManageUsers);
