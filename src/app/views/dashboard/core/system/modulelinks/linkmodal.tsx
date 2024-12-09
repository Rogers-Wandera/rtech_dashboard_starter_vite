import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { ModuleLinkType } from "@/types/app/core/system.types";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHexagonPlus } from "@tabler/icons-react";
import { useEffect } from "react";

type formvals = {
  linkname: string;
  route: string;
  render: string;
  position: number | null;
};

type props = {
  opened: boolean;
  close: () => void;
  refetch: TanStackRefetchType<PaginateResponse<ModuleLinkType>>;
  moduleId: string;
  editData: ModuleLinkType | null;
  setEditData: React.Dispatch<React.SetStateAction<ModuleLinkType | null>>;
};

const LinkModal = ({
  opened,
  close,
  refetch,
  moduleId,
  editData,
  setEditData,
}: props) => {
  const { postAsync } = useMutateData({
    queryKey: "modulelinks",
  });
  const dispatch = useAppDispatch();
  const form = useForm<formvals>({
    name: "modulelinks",
    initialValues: {
      linkname: "",
      route: "",
      render: "",
      position: null,
    },
    validate: {
      linkname: (value) =>
        value.length <= 1 ? "Link name must be atleast 2 letters" : null,
      route: (value) =>
        value.length <= 1 ? "Route must be atleast 2 letters" : null,
      render: (value) => (value.length < 1 ? "Render is required" : null),
    },
  });

  const HandleSubmit = async (values: formvals) => {
    try {
      dispatch(setLoading(true));
      const mainurl = "core/system/modulelinks/";
      const method = editData
        ? USE_MUTATE_METHODS.PATCH
        : USE_MUTATE_METHODS.POST;
      const render = Number(values.render);
      const postdata = editData
        ? { ...values, render }
        : { render, route: values.route, linkname: values.linkname };
      const endpoint = editData ? editData.id : moduleId;
      const response = await postAsync({
        endPoint: `${mainurl}` + endpoint,
        payload: postdata,
        method: method as USE_MUTATE_METHODS.POST,
      });
      notifier.success({ message: String(response.msg) });
      form.reset();
      close();
      await refetch();
      setEditData(null);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    if (opened && editData) {
      form.setValues({
        linkname: editData.linkname,
        route: editData.route,
        render: String(editData.render),
        position: editData.position,
      });
    }
  }, [editData]);
  return (
    <Modal
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      opened={opened}
      onClose={() => {
        close();
        form.reset();
        setEditData(null);
      }}
      title={
        <Group>
          <Title order={3}>{editData ? "Edit Link" : "Add Link"}</Title>
        </Group>
      }
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          await HandleSubmit(values);
        })}
      >
        <Grid>
          <Grid.Col>
            <TextInput
              label="Link name"
              {...form.getInputProps("linkname")}
              key={form.key("linkname")}
            />
          </Grid.Col>
          <Grid.Col>
            <TextInput
              label="Link Route"
              {...form.getInputProps("route")}
              key={form.key("route")}
            />
          </Grid.Col>
          {editData && (
            <Grid.Col>
              <NumberInput
                label="Position"
                {...form.getInputProps("position")}
                key={form.key("position")}
              />
            </Grid.Col>
          )}
          <Grid.Col>
            <Select
              label="Render"
              clearable
              data={[
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ]}
              {...form.getInputProps("render")}
              key={form.key("render")}
            />
          </Grid.Col>
          <Grid.Col>
            <Button type="submit" size="xs" leftSection={<IconHexagonPlus />}>
              Save
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};

export default LinkModal;
