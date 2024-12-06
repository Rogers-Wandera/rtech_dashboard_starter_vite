import Card from "@/components/shared/Card";
import { UserSingleView } from "@/types/app/core/user.type";
import { Col } from "react-bootstrap";
import {
  Card as CardMantine,
  Group,
  Text,
  Tooltip,
  Menu,
  rem,
  Modal,
  Select,
  Button,
} from "@mantine/core";
import {
  IconDots,
  IconHexagonPlus,
  IconTrashXFilled,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/hooks/auth.hooks";
import { useForm } from "@mantine/form";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { usePostData } from "@/hooks/usepost.hook";
import { useAppDispatch } from "@/hooks/store.hooks";
import { notifier } from "@/lib/utils/notify/notification";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import ConfirmModal from "@/components/shared/dialogs/confirm";
import { ROLES } from "@/types/enums/enum.types";

type props = {
  user: UserSingleView;
  refetch: () => void;
};
const ProfileLeft = ({ user, refetch }: props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const form = useForm({
    name: "roles",
    initialValues: {
      roleId: "",
    },
    validate: {
      roleId: (value) => (value.length < 1 ? "Please choose a role" : null),
    },
  });
  const { postAsync } = usePostData<ServerResponse>({
    queryKey: "roles" + user.id,
  });
  const rolestoassign = user.system_roles.unassigned;
  const { user: AuthUser } = useAuth();
  let assignroles: {
    value: string;
    label: string;
  }[] = [];
  if (rolestoassign && rolestoassign.length > 0) {
    assignroles = rolestoassign.map((role) => {
      return { value: String(role.id), label: role.rolename };
    });
  }

  const HandleAssignRoles = async (values: { roleId: string }) => {
    try {
      dispatch(setLoading(true));
      const data = { ...values, userId: user.id };
      const response = await postAsync({
        endPoint: "core/auth/users/roles",
        payload: data,
      });
      form.reset();
      close();
      notifier.success({ message: response?.msg as string });
      refetch();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  const HandleRemoveRole = (roleId: number) => {
    return ConfirmModal({
      message: `Are your sure you want to remove this role from ${
        AuthUser?.id === user.id ? "your self" : user.userName
      } , this will automatically ${
        AuthUser?.id === user.id
          ? "log you out and you will require to log in again"
          : `log ${user.userName} out if logged in.`
      }`,
      onConfirm: async () => {
        try {
          dispatch(setLoading(true));
          const data = { roleId: roleId, userId: user.id };
          const response = await postAsync({
            endPoint: "core/auth/users/roles",
            payload: data,
            method: "DELETE",
          });
          form.reset();
          close();
          notifier.success({ message: response?.msg as string });
          refetch();
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          HandleError(error as ServerErrorResponse);
        }
      },
    });
  };
  return (
    <Col lg="3" className="col-lg-3">
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={`Assign Roles to ${
          AuthUser?.id === user.id ? "your self" : user.userName
        }`}
      >
        <form onSubmit={form.onSubmit(HandleAssignRoles)}>
          <Select
            clearable
            data={assignroles}
            placeholder="Choose a role"
            key={form.key("roleId")}
            {...form.getInputProps("roleId")}
          />
          <Button type="submit" mt="sm">
            Add
          </Button>
        </form>
      </Modal>
      <Card>
        <Card.Header>
          <div className="header-title">
            <Group justify="space-between">
              <Text>Roles</Text>
              {AuthUser?.roles.includes(ROLES.ADMIN) &&
                user.system_roles?.unassigned &&
                user.system_roles.unassigned.length > 0 && (
                  <Tooltip
                    label="Assign Roles"
                    children={
                      <IconHexagonPlus
                        onClick={open}
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                )}
            </Group>
          </div>
        </Card.Header>
        <Card.Body>
          {user?.system_roles?.roles &&
            user.system_roles.roles.length > 0 &&
            user.system_roles.roles.map((role) => {
              return (
                <CardMantine
                  key={role.id}
                  shadow="none"
                  mb={10}
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Group justify="space-between" mt="md" mb="xs">
                    <Tooltip
                      label={role.description}
                      multiline
                      w={220}
                      zIndex={999}
                      position="top"
                      offset={5}
                      withArrow
                      transitionProps={{ duration: 200 }}
                      children={<Text fw={500}>{role.rolename}</Text>}
                    ></Tooltip>
                    {AuthUser?.roles.includes(ROLES.ADMIN) && (
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Tooltip
                            style={{ cursor: "pointer" }}
                            label="more"
                            children={
                              <IconDots style={{ cursor: "pointer" }} />
                            }
                          />
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Actions</Menu.Label>
                          <Menu.Item
                            onClick={() => HandleRemoveRole(role.roleId)}
                            leftSection={
                              <IconTrashXFilled
                                color="red"
                                style={{ width: rem(14), height: rem(14) }}
                              />
                            }
                          >
                            Remove
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>
                </CardMantine>
              );
            })}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProfileLeft;
