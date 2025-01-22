import { useAppDispatch } from "@/hooks/store.hooks";
import { useMutateData } from "@/hooks/data/usemutatehook";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { notifier } from "@/lib/utils/notify/notification";
import { UserGroup } from "@/types/app/core/user.type";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction, useEffect } from "react";

type props = {
  opened: boolean;
  close: () => void;
  setGroup: Dispatch<SetStateAction<UserGroup | null>>;
  group: UserGroup | null;
  refetch?: () => void;
};

type formprops = {
  groupName: string;
  description: string;
};
const GroupModal = ({ opened, close, group, refetch, setGroup }: props) => {
  const { postAsync } = useMutateData({
    queryKey: "post-user-groups",
  });
  const dispatch = useAppDispatch();
  const form = useForm<formprops>({
    initialValues: {
      groupName: "",
      description: "",
    },
    validate: {
      groupName: (value) =>
        value.length < 1 ? "Please enter group name" : null,
      description: (value) =>
        value.length < 1 ? "Please enter description" : null,
    },
  });

  const HandleSubmit = async (values: formprops) => {
    try {
      dispatch(setLoading(true));
      const url = group
        ? `core/auth/usergroups/${group.id}`
        : "/core/auth/usergroups";
      const method = group ? "PATCH" : "POST";
      const response = await postAsync({
        payload: values,
        endPoint: url,
        method: method as USE_MUTATE_METHODS,
      });
      notifier.success({ message: String(response.msg) });
      form.reset();
      refetch && (await refetch());
      setGroup(null);
      close();
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    if (group) {
      form.setValues({
        description: group.description,
        groupName: group.groupName,
      });
    }
  }, [group]);
  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        form.reset();
        setGroup(null);
      }}
      title="Add Group"
    >
      <form onSubmit={form.onSubmit((values) => HandleSubmit(values))}>
        <TextInput
          label="Group Name"
          key={form.key("groupName")}
          {...form.getInputProps("groupName")}
        />
        <Textarea
          label="Description"
          key={form.key("description")}
          {...form.getInputProps("description")}
        />
        <Button mt={10} type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default GroupModal;
