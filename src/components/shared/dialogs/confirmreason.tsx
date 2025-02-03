import { useMutateData } from "@/hooks/data/usemutatehook";
import { useAppDispatch } from "@/hooks/store.hooks";
import { setLoading } from "@/lib/store/services/defaults/defaults";
import { HandleError } from "@/lib/utils/errorhandler/server.error.handler";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { Grid, Modal, Text, Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ReactNode, useEffect } from "react";

type props = {
  endPoint: string;
  title?: ReactNode;
  message?: string | (() => string);
  opened: boolean;
  onClose?: () => void;
  type?: "danger" | "info";
  label?: string;
  additionalData?: Record<string, any>;
  method?: keyof typeof USE_MUTATE_METHODS;
  callBack?: (response: any) => void;
};

const ConfirmModalReason = ({
  opened,
  endPoint,
  type = "info",
  onClose = () => {},
  title = "Are you sure",
  message = "This is a message",
  additionalData = {},
  label = "Reason",
  method = "PATCH",
  callBack = () => {},
}: props) => {
  const dispatch = useAppDispatch();
  const { postAsync } = useMutateData({
    queryKey: `confirm-with-modal-${endPoint}`,
  });
  const form = useForm<{ reason: string }>({
    initialValues: {
      reason: "",
    },
  });

  const HandleSave = async (values: { reason: string }) => {
    try {
      dispatch(setLoading(true));
      const response = await postAsync({
        endPoint,
        payload: { ...values, ...additionalData },
        method: method as USE_MUTATE_METHODS,
      });
      callBack(response);
      dispatch(setLoading(false));
      onClose();
    } catch (error) {
      dispatch(setLoading(false));
      HandleError(error as ServerErrorResponse);
    }
  };

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  return (
    <Modal
      centered
      title={title}
      opened={opened}
      onClose={() => {
        onClose();
        form.reset();
      }}
    >
      <Text size="sm">
        {typeof message === "function" ? message() : message}
      </Text>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await HandleSave(values);
        })}
      >
        <Grid>
          <Grid.Col>
            <Textarea
              key={form.key("reason")}
              label={label}
              {...form.getInputProps("reason")}
            />
          </Grid.Col>
        </Grid>
        <div
          style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              form.reset();
            }}
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button type="submit" color={type === "danger" ? "red" : "blue"}>
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmModalReason;
