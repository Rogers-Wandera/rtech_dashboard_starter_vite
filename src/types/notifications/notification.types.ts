import { NotificationTypes, PRIORITY_TYPES } from "./notification.enum";

type mediaTypes = {
  type: "image" | "video" | "audio";
  imageUrl: string;
};

export type SystemNotificationData = {
  title: string;
  message: string;
  timestamp: Date;
  mediaUrl?: mediaTypes[];
  meta?: Record<string, string | number | Date | Boolean>;
};

export type NotificationTags = { name: string; link?: string };

export type SystemNotification = {
  pattern: string;
  priority: PRIORITY_TYPES;
  type: NotificationTypes;
  data: SystemNotificationData;
  recipients: { to: string; priority?: PRIORITY_TYPES }[];
  tags?: NotificationTags;
  link?: string;
  resendId?: string;
  createdBy?: string;
};

export type user_system_notifications = {
  uploads: SystemNotification[];
  announcements: SystemNotification[];
  other: SystemNotification[];
};
