import { TableColumnConfigs } from "@/components/tables/configs/mrtconfigs/shared.config";
import { MRT_ServerTable } from "@/components/tables/mrttables/server/mrtserverside";
import RouteRoles from "@/hocs/auth/verifyroles";
import { useAuth } from "@/hooks/auth/auth.hooks";
import { useMRTPaginateTable } from "@/hooks/data/usefetch.hook";
import { User } from "@/types/app/core/user.type";
import {
  PaginateResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import {
  user_schema,
  userformtype,
  usermenuitems,
  userscolumns,
} from "./userconfig";
import MaleImage from "@/assets/images/avatars/01.png";
import FemaleImage from "@/assets/images/avatars/lady.png";
import { Avatar, Badge } from "@mui/material";
import { useDisclosure } from "@mantine/hooks";
import UserModal from "./usermodal";
import { useForm, zodResolver } from "@mantine/form";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { IconLock } from "@tabler/icons-react";
import { styled } from "@mui/material/styles";
import Meta from "@/components/shared/meta";
import { useOutletContext } from "react-router";
import { OutLetContextType } from "@/types/app/app.types";
import { useMemo } from "react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(IconLock)(() => ({
  width: 22,
  height: 22,
  color: "red",
}));

const ManageUsers = () => {
  const { user } = useAuth();
  const state = useOutletContext<OutLetContextType>();

  let msg = "";
  if (user) {
    const online = state.online.filter((u) => u !== user.id).length;
    if (online) {
      msg = `${online} user(s) online now`;
    }
  }
  const [opened, { open, close }] = useDisclosure(false);
  const { postAsync } = useMutateData<ServerResponse>({
    queryKey: ["update_user"],
  });
  const moretableconfigs: TableColumnConfigs<User>[] = useMemo(
    () => [
      { accessorKey: "gender", filterSelectOptions: ["Male", "Female"] },
      {
        accessorKey: "image",
        Edit: () => null,
        Cell: ({ row }) => {
          const fallbackimage =
            row.original.gender === "Male" ? MaleImage : FemaleImage;
          const image = row.original.image ? row.original.image : fallbackimage;
          const isOnline = state.online.includes(row.original.id);
          let display = isOnline ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={user?.displayName} src={image} />
            </StyledBadge>
          ) : (
            <Avatar alt={user?.displayName} src={image} />
          );
          if (row.original.isLocked == 1) {
            display = (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={<SmallAvatar />}
              >
                <Avatar alt={user?.displayName} src={image} />
              </Badge>
            );
          }
          return display;
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
      {
        accessorKey: "verified",
        Edit: () => null,
        Cell: ({ row }) => {
          const display = row.original.verified === 0 ? "No" : "Yes";
          return display;
        },
      },
    ],
    [state.online]
  );

  const form = useForm<userformtype>({
    name: "user-form",
    mode: "uncontrolled",
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      gender: "",
      positionId: "",
      tel: "",
    },
    validate: zodResolver(user_schema),
  });

  const { refetch } = useMRTPaginateTable<PaginateResponse<User>>({
    queryKey: "users",
    endPoint: "core/auth/users",
  });

  return (
    <div>
      <Meta title="Users" header={`Manage Users ` + (msg ? `(${msg})` : "")} />

      <div style={{ display: opened ? "none" : "block" }}>
        <MRT_ServerTable<User>
          tablecolumns={userscolumns}
          columnConfigs={moretableconfigs}
          refetch={refetch}
          title="User"
          enableRowActions={true}
          enableEditing={true}
          rowactions={{
            editrender: false,
            deleterender: (row) =>
              row.original.id === user?.id ? false : true,
            actiontype: "menu",
          }}
          menuitems={[...usermenuitems({ user, refetch, postAsync })]}
          otherTableOptions={{ createDisplayMode: "custom" }}
          customCallBack={(table) => {
            table.setCreatingRow(true);
            form.reset();
            open();
          }}
          deleteModalProps={{
            confirmLabel: (row) => `Delete ${row.original.userName}`,
          }}
          serveractions={{ deleteEndPoint: "core/auth/users" }}
        />
      </div>
      <div style={{ display: opened ? "block" : "none" }}>
        <UserModal close={close} form={form} refetch={refetch} />
      </div>
    </div>
  );
};

export default RouteRoles(ManageUsers);
