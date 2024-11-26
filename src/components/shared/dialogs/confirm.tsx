import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

type props = {
  title?: string;
  message: string;
  labels?: { confirmLabel: string; cancelLabel: string };
  type?: "danger" | "info";
  onCancel?: () => void;
  onConfirm?: () => void;
};
const ConfirmModal = ({
  message,
  title = "Are you sure?",
  labels = { confirmLabel: "Confirm", cancelLabel: "Cancel" },
  type = "info",
  onConfirm = () => {},
  onCancel = () => {},
}: props) => {
  return modals.openConfirmModal({
    title: title,
    centered: true,
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: labels.confirmLabel, cancel: labels.cancelLabel },
    confirmProps: { color: type === "info" ? "green" : "red" },
    onCancel: onCancel,
    onConfirm: onConfirm,
  });
};

export default ConfirmModal;
