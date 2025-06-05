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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
  sender?: {
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  videoUrl?: string;
  body?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
}

export enum NotificationStatus {
  QUEUED = "queued",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
  PARTIAL = "partial",
  PROCESSING = "processing",
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
}
