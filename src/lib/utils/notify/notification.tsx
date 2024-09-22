import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconThumbDown, IconInfoHexagon } from "@tabler/icons-react";

type NotifierProps = {
  message: string;
  title?: string;
};
export const notifier = {
  success: ({ message, title = "Operation successful" }: NotifierProps) =>
    notifications.show({
      title: title,
      message: message,
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
  error: ({ message, title = "An Error Occured" }: NotifierProps) => {
    return notifications.show({
      title: title,
      message: message,
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
  info: ({ message, title = "Info" }: NotifierProps) =>
    notifications.show({
      title: title,
      message: message,
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
