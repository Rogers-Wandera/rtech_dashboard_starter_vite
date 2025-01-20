import ConfirmModal from "@/components/shared/dialogs/confirm";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { ServerRoles } from "@/types/app/auth/auth.types";
import {
  ServerLinkPermission,
  ServerLinkRole,
} from "@/types/app/core/system.types";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material";
import { IconFolder } from "@tabler/icons-react";
import { useState } from "react";

type props = {
  permission: ServerLinkPermission;
  linkRoleId: number;
  refetch: TanStackRefetchType<PaginateResponse<ServerRoles>>;
  link: ServerLinkRole;
};
const RolePermissionPage = ({
  permission,
  linkRoleId,
  refetch,
  link,
}: props) => {
  const [checked, setChecked] = useState(Number(permission.checked) === 1);
  const dispatch = useAppDispatch();
  const { postAsync } = useMutateData({ queryKey: "user-permissions-assign" });

  const HandleAddPermission = () => {
    return ConfirmModal({
      message:
        `Are you sure you want to ${
          Number(permission.checked) === 1 ? "remove" : "add"
        } this permission, ` + permission.description,
      type: Number(permission.checked) === 1 ? "danger" : "info",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const url =
            Number(permission.checked) === 1
              ? `core/auth/permissions/${permission.rpId}`
              : `core/auth/permissions/${linkRoleId}/${permission.id}`;
          const method =
            Number(permission.checked) === 1
              ? USE_MUTATE_METHODS.DELETE
              : USE_MUTATE_METHODS.POST;
          const response = await postAsync({
            endPoint: url,
            payload: {},
            method: method,
          });
          notifier.success({ message: String(response.msg) });
          setChecked(!checked);
          await refetch();
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };
  return (
    <ListItem>
      <ListItemIcon>
        <IconFolder />
      </ListItemIcon>
      <ListItemText
        id={String(permission.id)}
        primary={`${permission.accessName} ${
          link?.groupId !== null && "(Group Permission)"
        }`}
        secondary={permission.description}
      />
      <Switch
        checked={checked}
        onClick={HandleAddPermission}
        inputProps={{
          "aria-labelledby": "switch-list-label-wifi",
        }}
        disabled={link?.groupId !== null}
      />
    </ListItem>
  );
};

export default RolePermissionPage;
