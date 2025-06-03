export enum PRIORITY_TYPES {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum NOTIFICATION_TYPES {
  USER_NOTIFICATIONS = "USER_NOTIFICATIONS",
  UPDATE_READ = "UPDATE_READ",
}

export enum NotificationTypes {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
  CUSTOM = "custom",
}

export enum NOTIFICATION_STATUS {
  SENT = "sent",
  RECIEVED = "recieved",
  READ = "read",
  FAILED = "failed",
}

export type NotificationType = "unread" | "read" | "sent" | "urgent" | "system";
