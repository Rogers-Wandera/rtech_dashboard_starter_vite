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
  MoreTableConfigsData,
  user_schema,
  userformtype,
  usermenuitems,
  userscolumns,
} from "./userconfig";
import { useDisclosure } from "@mantine/hooks";
import UserModal from "./usermodal";
import { useForm, zodResolver } from "@mantine/form";
import { useMutateData } from "@/hooks/data/usemutatehook";
import Meta from "@/components/shared/meta";
import { useOutletContext } from "react-router";
import { OutLetContextType } from "@/types/app/app.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmModalReason from "@/components/shared/dialogs/confirmreason";
import { MRT_Row } from "material-react-table";
import { notifier } from "@/lib/utils/notify/notification";
import { useSocketEvent } from "@/hooks/services/socket.hooks";
import { USER_EVENTS } from "@/types/enums/event.enums";

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
  const [confirm, { open: Open, close: Close }] = useDisclosure(false);
  const [row, setRow] = useState<MRT_Row<User> | null>(null);
  const { postAsync } = useMutateData<ServerResponse>({
    queryKey: ["update_user"],
  });

  const { refetch } = useMRTPaginateTable<PaginateResponse<User>>({
    queryKey: "users",
    endPoint: "core/auth/users",
  });

  useSocketEvent(USER_EVENTS.REFETCH_USERS, () => refetch());

  const menuitems = useCallback(
    () => usermenuitems({ user, refetch, postAsync, open: Open, setRow }),
    [user, refetch, postAsync]
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

  const moretableconfigs: TableColumnConfigs<User>[] = useMemo(
    () => MoreTableConfigsData(state, user),
    [state.online]
  );

  useEffect(() => {}, []);

  return (
    <div>
      <Meta title="Users" header={`Manage Users ` + (msg ? `(${msg})` : "")} />
      <ConfirmModalReason
        opened={confirm}
        type="danger"
        additionalData={{ isLocked: row?.original.isLocked === 1 ? 0 : 1 }}
        callBack={(response) => {
          notifier.success({ message: response?.msg as string });
          refetch();
        }}
        endPoint={`core/auth/users/lock/${row?.original.id}`}
        onClose={() => {
          Close();
          setRow(null);
        }}
        message={`Are you certain, you want to ${
          row?.original.isLocked == 1 ? "unlock" : "lock"
        } the user, ${
          row?.original.isLocked == 0
            ? `this action will make
      the user be logged out of the system if they are logged in`
            : `this will make the user have access to the system again.`
        } ${
          row?.original.isLocked == 0
            ? `,
      and they will not be able to log in until unlocked`
            : "."
        }`}
      />

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
          menuitems={menuitems()}
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
