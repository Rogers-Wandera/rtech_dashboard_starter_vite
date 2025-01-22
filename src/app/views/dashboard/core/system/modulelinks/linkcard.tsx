import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconLockOpen2,
  IconLockFilled,
  IconDeviceProjector,
  IconHomeX,
  IconTransfer,
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
  Divider,
  Button,
  Box,
} from "@mantine/core";
import { ModuleLinkType } from "@/types/app/core/system.types";
import React from "react";
import ConfirmModal from "@/components/shared/dialogs/confirm";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { useDeleteData } from "@/hooks/data/usedelete.hook";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import { useDisclosure } from "@mantine/hooks";
import LinkPermissionCard from "./permissions/permissioncard";
import { TransferLinkModal } from "./linkmodal";

type props = {
  link: ModuleLinkType;
  setEditData: React.Dispatch<React.SetStateAction<ModuleLinkType | null>>;
  open: () => void;
  refetch: TanStackRefetchType<PaginateResponse<ModuleLinkType>>;
};
function LinkCard({ link, setEditData, open, refetch }: props) {
  const { postAsync } = useMutateData({
    queryKey: "modulelinks",
  });
  const [show_permission, { open: Show, close: Hide }] = useDisclosure(false);
  const { deleteAsync } = useDeleteData({ queryKey: "module-links-delete" });
  const dispatch = useAppDispatch();
  const [opened, { open: opener, close }] = useDisclosure(false);

  const HandleDelete = () => {
    return ConfirmModal({
      message: "Are you sure you want to delete this link " + link.linkname,
      type: "danger",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const response = await deleteAsync({
            endPoint: "core/system/modulelinks/" + link.id,
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

  const UpdateRenderReleased = (type: "render" | "released") => {
    return ConfirmModal({
      message:
        `Are you sure you want to ${
          type === "render"
            ? link.render === 1
              ? "remove render for"
              : "render"
            : link.released === 1
            ? "remove released for"
            : "enable"
        } this link ` + link.linkname,
      type: "danger",
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const tosend =
            type === "render"
              ? { render: link.render === 1 ? 0 : 1 }
              : { released: link.released === 1 ? 0 : 1 };
          const response = await postAsync({
            endPoint: "core/system/modulelinks/" + link.id,
            method: USE_MUTATE_METHODS.PATCH,
            payload: {
              ...tosend,
              position: link.position,
              linkname: link.linkname,
              route: link.route,
            },
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
    <Card withBorder padding="lg" radius="md" style={{ cursor: "pointer" }}>
      <TransferLinkModal
        opened={opened}
        close={close}
        refetch={refetch}
        link={link}
      />
      {show_permission && (
        <LinkPermissionCard
          close={Hide}
          permissions={link.permissions}
          linkId={link.id}
          refetch={refetch}
        />
      )}
      {!show_permission && (
        <Box>
          <Group justify="space-between">
            <Flex direction="column">
              <Group>
                <Title order={3}>{link.linkname}</Title>
                <Badge size="sm" color={link.released === 1 ? "green" : "pink"}>
                  {link.released === 1 ? "Released" : "Not Released"}
                </Badge>
              </Group>
              <Text>{link.route}</Text>
            </Flex>
            <Avatar size="lg" alt="supervisor">
              {String(
                link.linkname.includes(" ")
                  ? `${link.linkname.split(" ")[0][0]}${
                      link.linkname.split(" ")[1][0]
                    }`
                  : link.linkname.slice(0, 2)
              ).toUpperCase()}
            </Avatar>
          </Group>
          <Text fz="sm" c="dimmed" mt={5}>
            {link.released === 1 && link.render === 1
              ? "The link is released and  available for assignment on the user or group roles screen."
              : link.released === 1 && link.render === 0
              ? "The link is  released but not available to the users for assignment."
              : link.render === 1 && link.released === 0
              ? "The link has an interface but not yet released for assignment"
              : "The link has not yet been released"}
          </Text>
          <Divider my="md" />
          <Text fz="sm" c="dimmed" mt={5}>
            <span>Has Interface: {link.render === 1 ? "Yes" : "No"}</span>{" "}
            <br />
          </Text>

          <Divider my="md" />
          <Group justify="space-between" mt="md">
            <Flex gap={10}>
              <Button
                onClick={() => {
                  setEditData(link);
                  open();
                }}
                leftSection={<IconEdit />}
              >
                Edit
              </Button>
              <Button
                onClick={HandleDelete}
                color="red"
                leftSection={<IconTrash />}
              >
                Delete
              </Button>
            </Flex>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="default" size="lg" radius="md">
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Configs</Menu.Label>
                <Menu.Item
                  onClick={() => UpdateRenderReleased("released")}
                  leftSection={
                    link.released === 1 ? (
                      <IconLockFilled
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    ) : (
                      <IconLockOpen2
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    )
                  }
                >
                  {link.released === 1 ? "Unrelease" : "Release"}
                </Menu.Item>
                <Menu.Item
                  onClick={() => UpdateRenderReleased("render")}
                  leftSection={
                    link.render === 1 ? (
                      <IconHomeX style={{ width: rem(14), height: rem(14) }} />
                    ) : (
                      <IconDeviceProjector
                        style={{
                          width: rem(14),
                          height: rem(14),
                        }}
                      />
                    )
                  }
                >
                  {link.render === 1 ? "Don't Render" : "Render"}
                </Menu.Item>
                <Menu.Item
                  onClick={Show}
                  leftSection={
                    <IconEye style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Permissions
                </Menu.Item>
                <Menu.Item
                  onClick={opener}
                  leftSection={
                    <IconTransfer style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Transfer
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>
      )}
    </Card>
  );
}

export default LinkCard;
