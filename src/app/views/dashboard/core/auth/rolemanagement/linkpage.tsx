import { ServerLinkRole } from "@/types/app/core/system.types";
import { UserGroup, UserSingleView } from "@/types/app/core/user.type";
import { ActionIcon, Badge, Checkbox, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconEye,
  IconLockFilled,
  IconEyeOff,
} from "@tabler/icons-react";
import RoleModal from "./rolemodal";
import { Fragment, useState } from "react";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { ServerRoles } from "@/types/app/auth/auth.types";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import LinkRolePermission from "./permission/permission";

type user_roles = {
  type: "user";
  data: UserSingleView;
  link: ServerLinkRole;
};

type group_roles = {
  type: "group";
  data: UserGroup;
  link: ServerLinkRole;
};

type props = (user_roles | group_roles) & {
  refetch: TanStackRefetchType<PaginateResponse<ServerRoles>>;
};

const LinkRolePage = ({ link, refetch, type, data }: props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [show, { toggle }] = useDisclosure(false);
  const [checked, setChecked] = useState(link.is_assigned === 1);
  const [isEditing, setEditing] = useState<boolean | null>(null);
  const HandleCreateEdit = async () => {
    if (checked === false) {
      open();
    } else {
      await HandleAssignRole(null, "remove");
    }
  };
  const dispatch = useAppDispatch();
  const { postAsync } = useMutateData({ queryKey: "assign-roles" });

  const HandleAssignRole = async (
    date: string | null = null,
    savetype: "assign" | "remove" = "assign"
  ) => {
    try {
      dispatch(setLoading(true));
      const datedata = date ? { expireDate: date } : {};
      const datatype =
        type === "user" ? { userId: data.id } : { groupId: data.id };
      let payload = {};
      const mainurl =
        "core/auth/linkroles/" +
        `${
          (savetype === "assign" && isEditing) || savetype === "remove"
            ? link.linkRoleId
            : link.id
        }`;
      const method =
        savetype === "assign" && isEditing === null
          ? USE_MUTATE_METHODS.POST
          : savetype === "assign" && isEditing
          ? USE_MUTATE_METHODS.PATCH
          : USE_MUTATE_METHODS.DELETE;
      if (method === USE_MUTATE_METHODS.POST) {
        payload = { ...datedata, ...datatype };
      } else if (method === USE_MUTATE_METHODS.PATCH) {
        payload = { ...datedata };
      } else {
        payload = {};
      }
      const response = await postAsync({
        endPoint: mainurl,
        payload: payload,
        method: method as USE_MUTATE_METHODS.POST,
      });
      notifier.success({ message: String(response.msg) });
      await refetch();
      setChecked(!checked);
      close();
      setEditing(null);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };
  return (
    <Fragment>
      <Table.Tr style={{ borderBottom: "none", borderTop: "none" }}>
        <RoleModal
          HandleAssignRole={HandleAssignRole}
          opened={opened}
          close={close}
          isEditing={isEditing}
          link={link}
        />
        <Table.Td style={{ paddingLeft: "20px", border: "none" }}>
          {link.linkname}
          {link.expired === 1 && (
            <Badge ml={5} size="xs" color="red">
              Expired {link.days_left} days
            </Badge>
          )}
          {link.expired === 0 && link.days_left && link.days_left <= 3 && (
            <Badge ml={5} size="xs" color="red">
              Expiring in {link.days_left}{" "}
              {link.days_left === 1 ? "day" : "days"}
            </Badge>
          )}
        </Table.Td>
        <Table.Td style={{ border: "none", paddingLeft: "40px" }}>
          <Checkbox
            onChange={HandleCreateEdit}
            checked={link.is_assigned === 1}
            color="violet"
            size="md"
            label={type === "user" && link?.groupId !== null && "Group Role"}
            disabled={type === "user" && link?.groupId !== null}
          />
        </Table.Td>
        <Table.Td style={{ border: "none", paddingLeft: "20px" }}>
          {link.is_assigned === 1 && link.expired === 0 && (
            <ActionIcon color={!show ? "blue" : "gray"} onClick={toggle}>
              <Tooltip label={show ? "Close Permission" : "View Permissions"}>
                {!show ? <IconEye size={16} /> : <IconEyeOff size={16} />}
              </Tooltip>
            </ActionIcon>
          )}
          {(link.is_assigned === 0 || link.expired === 1) && (
            <ActionIcon color="red">
              <Tooltip label="Permissions Locked">
                <IconLockFilled size={16} />
              </Tooltip>
            </ActionIcon>
          )}

          {link.is_assigned === 1 &&
            (link.expired === 1 || (link.days_left && link.days_left <= 3)) && (
              <ActionIcon
                disabled={type === "user" && link?.groupId !== null}
                color="green"
                ml={4}
                onClick={() => {
                  setEditing(true);
                  open();
                }}
              >
                <Tooltip label="Permissions Locked">
                  <IconEdit size={16} />
                </Tooltip>
              </ActionIcon>
            )}
        </Table.Td>
      </Table.Tr>

      {show && (
        <Table.Tr>
          <Table.Td colSpan={3}>
            <LinkRolePermission link={link} refetch={refetch} type={type} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  );
};

export default LinkRolePage;
