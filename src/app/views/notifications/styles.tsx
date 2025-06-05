import { alpha, rem, useMantineColorScheme } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

const useStyles = createStyles((theme) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return {
    notificationContainer: {
      display: "flex",
      gap: theme.spacing.md,
      maxWidth: rem(1200),
      margin: "0 auto",
      padding: theme.spacing.md,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexDirection: "column",
      },
    },
    sidebar: {
      width: rem(250),
      flexShrink: 0,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: "100%",
      },
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
    },
    header: {
      paddingBottom: theme.spacing.md,
      borderBottom: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },
    notification: {
      transition: "all 0.2s ease",
      borderLeft: `${rem(4)} solid transparent`,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: theme.shadows.md,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: rem(4),
        backgroundColor: "transparent",
        transition: "background-color 0.2s ease",
      },
      "&:hover::before": {
        backgroundColor: theme.colors.blue[5],
      },
    },
    unread: {
      borderLeftColor: theme.colors.blue[6],
      backgroundColor: isDark
        ? alpha(theme.colors.blue[9], 0.2)
        : theme.colors.blue[0],
    },
    read: {
      borderLeftColor: theme.colors.gray[4],
    },
    sent: {
      borderLeftColor: theme.colors.teal[6],
      backgroundColor: isDark
        ? alpha(theme.colors.teal[9], 0.2)
        : theme.colors.teal[0],
    },
    urgent: {
      borderLeftColor: theme.colors.red[6],
      backgroundColor: isDark
        ? alpha(theme.colors.red[9], 0.2)
        : theme.colors.red[0],
    },
    system: {
      borderLeftColor: theme.colors.violet[6],
      backgroundColor: isDark
        ? alpha(theme.colors.violet[9], 0.2)
        : theme.colors.violet[0],
    },
    mediaContainer: {
      position: "relative",
      borderRadius: theme.radius.md,
      overflow: "hidden",
      marginTop: theme.spacing.sm,
      border: `${rem(1)} solid ${
        isDark ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    },
    mediaBadge: {
      position: "absolute",
      bottom: theme.spacing.xs,
      right: theme.spacing.xs,
      backdropFilter: "blur(4px)",
      backgroundColor: isDark
        ? alpha(theme.colors.dark[7], 0.7)
        : alpha(theme.colors.gray[0], 0.7),
      color: isDark ? theme.white : theme.black,
      border: `${rem(1)} solid ${
        isDark ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
    timestamp: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.xs,
      color: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
      fontSize: theme.fontSizes.xs,
    },
    detailsTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    closeButton: {
      position: "absolute",
      top: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 10,
    },
    notificationContent: {
      flex: 1,
      minWidth: 0,
    },
    notificationActions: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: "100%",
        justifyContent: "flex-end",
      },
    },
    badgeIcon: {
      marginRight: rem(4),
    },
    detailsBody: {
      lineHeight: 1.6,
      "& p": {
        marginBottom: theme.spacing.sm,
      },
    },
    actionButton: {
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateX(4px)",
      },
    },
    filterCard: {
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
      },
    },
    activeFilter: {
      borderLeft: `${rem(4)} solid ${theme.colors.blue[6]}`,
      backgroundColor: isDark
        ? alpha(theme.colors.blue[9], 0.3)
        : theme.colors.blue[1],
    },
    filterIcon: {
      marginRight: theme.spacing.sm,
    },
    emptyState: {
      textAlign: "center",
      padding: theme.spacing.xl,
      color: isDark ? theme.colors.dark[3] : theme.colors.gray[6],
    },
    createButton: {
      marginBottom: theme.spacing.md,
    },
    formContainer: {
      padding: theme.spacing.md,
    },
  };
});

export default useStyles;
