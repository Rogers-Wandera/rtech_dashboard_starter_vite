import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconInfoCircle,
  IconPointFilled,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Text,
  Title,
  Menu,
  rem,
  Alert,
} from "@mantine/core";
import { UserGroup } from "@/types/app/core/user.type";
import manAvatar from "@/assets/images/avatars/man.png";
import womanAvatar from "@/assets/images/avatars/woman.png";
import TruncatedText from "@/components/shared/truncatedtext";
import { useNavigate } from "react-router";
import { helpers } from "@/lib/utils/helpers/helper";
import { Dispatch, SetStateAction } from "react";
import { useDeleteData } from "@/hooks/data/usedelete.hook";
import ConfirmModal from "@/components/shared/dialogs/confirm";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { notifier } from "@/lib/utils/notify/notification";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import { useAppContext } from "@/lib/context/app/app.context";
import { AppActions } from "@/lib/reducers/app/app.actions";

type props = {
  group: UserGroup;
  setGroup: Dispatch<SetStateAction<UserGroup | null>>;
  open: () => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<PaginateResponse<UserGroup>, ServerErrorResponse>
  >;
};
const GroupCard = ({ group, setGroup, open, refetch }: props) => {
  const dispatch = useAppDispatch();
  const { deleteAsync } = useDeleteData({ queryKey: "delete-user-groups" });
  const { postAsync } = useMutateData({ queryKey: "patch-user-groups" });
  const navigate = useNavigate();
  const members = group.members.slice(0, 2);
  const otherLength = group.members.length - members.length;
  const appState = useAppContext();
  let supervisor = group.supervisor.find(
    (supervisor) => supervisor.isMain === 1
  );
  if (!supervisor && group.supervisor.length > 0) {
    supervisor = group.supervisor[0];
  }
  const actionsShow = group.status === "active";

  const HandleDelete = () => {
    return ConfirmModal({
      message: `Are you sure, you want to delete this group 
      [${group.groupName}], this action is destructive 
      and u will need to contact system support to restore your data
      within 30days after deletion`,
      type: "danger",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const response = await deleteAsync({
            endPoint: `core/auth/usergroups/${group.id}`,
          });
          notifier.success({ message: String(response.msg) });
          await refetch();
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };

  const EnableDisableGroup = () => {
    return ConfirmModal({
      message: `Are you sure, you want to ${
        actionsShow ? "disable" : "enable"
      } this group 
      [${group.groupName}].`,
      type: "info",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const response = await postAsync({
            endPoint: `core/auth/usergroups/status/${group.id}`,
            method: USE_MUTATE_METHODS.PATCH,
            payload: {},
          });
          notifier.success({ message: String(response.msg) });
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
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between">
        <Title order={3}>{group.groupName}</Title>
        <Badge
          size="sm"
          leftSection={
            <IconPointFilled
              color={group.status === "active" ? "green" : "red"}
            />
          }
          color={group.status === "active" ? "lime.4" : "red.4"}
        >
          {group.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </Group>

      {supervisor && (
        <Group pt={20}>
          <Avatar
            size="lg"
            src={
              supervisor?.userImage
                ? supervisor.userImage
                : supervisor?.gender?.toLowerCase() === "male"
                ? manAvatar
                : womanAvatar
            }
            alt="supervisor"
          />
          <Flex direction="column">
            <Title order={4}>{supervisor?.userName}</Title>
            <Text>Supervisor</Text>
          </Flex>
        </Group>
      )}
      {!supervisor && (
        <Alert
          variant="light"
          color="indigo"
          title="No group supervisor, u can add one"
          icon={<IconInfoCircle />}
        ></Alert>
      )}
      <TruncatedText text={group.description} maxLength={60} />

      <Group justify="space-between" mt="md">
        {members.length > 0 && (
          <Avatar.Group spacing="sm">
            {members.map((member) => {
              const image = member?.userImage
                ? member.userImage
                : member?.gender?.toLowerCase() === "male"
                ? manAvatar
                : womanAvatar;
              return <Avatar key={member.id} src={image} radius="xl" />;
            })}
            {otherLength > 0 && <Avatar radius="xl">+{otherLength}</Avatar>}
          </Avatar.Group>
        )}
        {members.length === 0 && (
          <Alert
            variant="light"
            color="indigo"
            title="No members found in the group"
            icon={<IconInfoCircle />}
          ></Alert>
        )}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="default" size="lg" radius="md">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            {actionsShow && (
              <Menu.Item
                onClick={() => {
                  if (actionsShow) {
                    appState.dispatch({
                      type: AppActions.PAGE_STATE,
                      payload: group,
                    });
                    navigate(
                      `/dashboard/core/auth/usergroups/${helpers.encryptUrl(
                        group.id.toString()
                      )}`
                    );
                  }
                }}
                leftSection={
                  <IconEye style={{ width: rem(14), height: rem(14) }} />
                }
              >
                View
              </Menu.Item>
            )}
            {actionsShow && (
              <Menu.Item
                onClick={() => {
                  setGroup(group);
                  open();
                }}
                leftSection={
                  <IconEdit style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Edit
              </Menu.Item>
            )}

            <Menu.Item
              onClick={EnableDisableGroup}
              leftSection={
                actionsShow ? (
                  <IconThumbDown style={{ width: rem(14), height: rem(14) }} />
                ) : (
                  <IconThumbUp style={{ width: rem(14), height: rem(14) }} />
                )
              }
            >
              {actionsShow ? "Disable" : "Enable"}
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item
              color="red"
              onClick={HandleDelete}
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
};
export default GroupCard;
