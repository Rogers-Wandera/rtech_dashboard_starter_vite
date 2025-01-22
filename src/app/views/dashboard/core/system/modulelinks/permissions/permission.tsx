import ConfirmModal from "@/components/shared/dialogs/confirm";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useDeleteData } from "@/hooks/data/usedelete.hook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { Permission } from "@/types/app/auth/auth.types";
import { ModuleLinkType } from "@/types/app/core/system.types";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { Tooltip } from "@mantine/core";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { IconFolder, IconTrashFilled, IconEdit } from "@tabler/icons-react";

type props = {
  permission: Permission;
  open: () => void;
  setEditData: React.Dispatch<React.SetStateAction<Permission | null>>;
  refetch: TanStackRefetchType<PaginateResponse<ModuleLinkType>>;
};
const LinkPermission = ({ permission, open, setEditData, refetch }: props) => {
  const { deleteAsync } = useDeleteData({ queryKey: "module-links-delete" });
  const dispatch = useAppDispatch();

  const HandleDelete = () => {
    return ConfirmModal({
      message:
        "Are you sure you want to delete this permision " +
        `'${permission.accessName}'`,
      type: "danger",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const response = await deleteAsync({
            endPoint: "core/system/linkpermission/" + permission.id,
          });
          notifier.success({ message: String(response.msg) });
          await refetch();
          dispatch(setLoading(true));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };
  return (
    <ListItem
      secondaryAction={
        <>
          <Tooltip
            label="Edit"
            onClick={() => {
              setEditData(permission);
              open();
            }}
          >
            <IconButton color="success" edge="end" aria-label="delete">
              <IconEdit />
            </IconButton>
          </Tooltip>
          <Tooltip label="Delete" onClick={HandleDelete}>
            <IconButton color="error" edge="end" aria-label="delete">
              <IconTrashFilled />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <IconFolder />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={permission.accessName}
        secondary={permission.accessRoute}
      />
    </ListItem>
  );
};

export default LinkPermission;
