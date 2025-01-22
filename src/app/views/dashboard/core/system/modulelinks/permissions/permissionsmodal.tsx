import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { TanStackRefetchType } from "@/types/app/app.types";
import { Permission } from "@/types/app/auth/auth.types";
import { ModuleLinkType } from "@/types/app/core/system.types";
import { METHODS, USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import {
  Button,
  Grid,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

type props = {
  opened: boolean;
  close: () => void;
  editData: Permission | null;
  setEditData: React.Dispatch<React.SetStateAction<Permission | null>>;
  linkId: number;
  refetch: TanStackRefetchType<PaginateResponse<ModuleLinkType>>;
};

type formvals = {
  accessName: string;
  accessRoute: string;
  method: METHODS;
  description: string;
};
const LinkPermissionModal = ({
  opened,
  close,
  editData,
  linkId,
  refetch,
  setEditData,
}: props) => {
  const { postAsync } = useMutateData({
    queryKey: "permissions",
  });
  const dispatch = useAppDispatch();

  const form = useForm<formvals>({
    name: "permissions-form",
    initialValues: {
      accessName: "",
      accessRoute: "",
      method: METHODS.GET,
      description: "",
    },
    validate: {
      accessName: (value) =>
        value.length > 0 ? null : "Access Name is required",
      accessRoute: (value) =>
        value.length > 0 ? null : "Access Route is required",
      method: (value) => (value.length > 0 ? null : "Method is required"),
      description: (value) =>
        value.length > 0 ? null : "Description is required",
    },
  });

  const HandleSubmit = async (values: formvals) => {
    try {
      dispatch(setLoading(true));
      const mainurl = "core/system/linkpermission/";
      const method = editData
        ? USE_MUTATE_METHODS.PATCH
        : USE_MUTATE_METHODS.POST;
      const endpoint = editData ? editData.id : linkId;
      const response = await postAsync({
        endPoint: `${mainurl}` + endpoint,
        payload: values,
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
        accessName: editData.accessName,
        accessRoute: editData.accessRoute,
        method: editData.method,
        description: editData.description,
      });
    }
  }, [editData]);
  return (
    <Modal
      centered
      opened={opened}
      onClose={() => {
        close();
        form.reset();
        setEditData(null);
      }}
      title={editData ? "Edit Permission" : "Add Permission"}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          await HandleSubmit(values);
        })}
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput
              label="Access Name"
              key={form.key("accessName")}
              {...form.getInputProps("accessName")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput
              label="Access Route"
              key={form.key("accessRoute")}
              {...form.getInputProps("accessRoute")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
            <Select
              label="Method"
              data={[
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS",
                "HEAD",
              ]}
              key={form.key("method")}
              {...form.getInputProps("method")}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Description"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />
          </Grid.Col>
        </Grid>
        <Button type="submit" mt={20}>
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default LinkPermissionModal;
