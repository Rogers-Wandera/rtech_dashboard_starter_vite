import { NotificationType } from "@/types/notifications/notification.enum";
import { Badge } from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconMail,
  IconSend,
} from "@tabler/icons-react";

const NotificationBadge = ({
  type,
  classes,
}: {
  type: NotificationType;
  classes: Record<string, any>;
}) => {
  const getIcon = () => {
    switch (type) {
      case "unread":
        return <IconMail size={14} className={classes.badgeIcon} />;
      case "sent":
        return <IconSend size={14} className={classes.badgeIcon} />;
      case "urgent":
        return <IconAlertCircle size={14} className={classes.badgeIcon} />;
      case "system":
        return <IconCircleCheck size={14} className={classes.badgeIcon} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case "unread":
        return "blue";
      case "sent":
        return "teal";
      case "urgent":
        return "red";
      case "system":
        return "violet";
      default:
        return "gray";
    }
  };

  return (
    <Badge
      size="sm"
      variant="light"
      color={getColor()}
      leftSection={getIcon()}
      radius="sm"
    >
      {type}
    </Badge>
  );
};

export default NotificationBadge;
