import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconThumbDown, IconInfoHexagon } from "@tabler/icons-react";

type NotifierProps = {
  message: string;
  title?: string;
  timer?: number;
};
export const notifier = {
  success: ({
    message,
    title = "Operation successful",
    timer = 3000,
  }: NotifierProps) =>
    notifications.show({
      title: title,
      message: message,
      autoClose: timer,
      color: "white",
      styles: () => ({
        root: {
          background: "#2F9E44",
        },
        title: { color: "var(--mantine-color-white)" },
        description: { color: "var(--mantine-color-white)" },
        closeButton: { color: "var(--mantine-color-white)" },
      }),
      icon: (
        <IconCheck color="green" style={{ width: rem(18), height: rem(18) }} />
      ),
    }),
  error: ({
    message,
    title = "An Error Occured",
    timer = 3000,
  }: NotifierProps) => {
    return notifications.show({
      title: title,
      message: message,
      autoClose: timer,
      color: "red",
      styles: () => ({
        root: {
          background: "#F03E3E",
        },
        title: { color: "var(--mantine-color-white)" },
        description: { color: "var(--mantine-color-white)" },
        closeButton: { color: "var(--mantine-color-white)" },
      }),
      icon: (
        <IconThumbDown
          color="white"
          style={{ width: rem(18), height: rem(18) }}
        />
      ),
    });
  },
  info: ({ message, title = "Info", timer = 3000 }: NotifierProps) =>
    notifications.show({
      title: title,
      message: message,
      autoClose: timer,
      color: "blue",
      styles: () => ({
        root: {
          background: "#4263EB",
        },
        title: { color: "var(--mantine-color-white)" },
        description: { color: "var(--mantine-color-white)" },
        closeButton: { color: "var(--mantine-color-white)" },
      }),
      icon: (
        <IconInfoHexagon
          color="blue"
          style={{ width: rem(18), height: rem(18) }}
        />
      ),
    }),
};
