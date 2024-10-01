import {
  RowMenuItems,
  TableColumns,
} from "@/components/tables/configs/mrtconfigs/mrtserverside.configs";
import { User } from "@/types/app/core/user.type";
import { IconLock, IconLockOff } from "@tabler/icons-react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { MRT_Row } from "material-react-table";
import { IAuthUser } from "@/types/server/server.main.types";

export const userscolumns: TableColumns<User>[] = [
  { accessorKey: "image", header: "Image", type: "text" },
  { accessorKey: "userName", header: "Full Name", type: "text" },
  { accessorKey: "gender", type: "select", header: "Gender" },
  { accessorKey: "position", type: "text", header: "Position" },
  { accessorKey: "last_active", type: "text", header: "Last Seen" },
];

export const usermenuitems = (user: IAuthUser | null): RowMenuItems<User>[] => {
  return [
    {
      label: (row: MRT_Row<User>) =>
        row.original.isLocked === 1 ? "UnLock" : "Lock",
      icon: (row: MRT_Row<User>) =>
        row.original.isLocked === 1 ? <IconLockOff /> : <IconLock />,
      onClick: () => {},
      render: (row: MRT_Row<User>) =>
        row.original.id === user?.id ? false : true,
    },
    {
      label: "Manage",
      icon: <ManageAccountsIcon color="secondary" />,
      onClick: () => {},
    },
  ];
};
