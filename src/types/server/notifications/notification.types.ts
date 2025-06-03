import { EmailTemplates, PushTemplates } from "./templates.type";
import {
  ApnsPayload,
  ApnsConfig,
  WebpushConfig,
  AndroidConfig,
} from "firebase-admin/messaging";

export type AttachmentType =
  | "image"
  | "video"
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "audio"
  | "text"
  | "other";

export type Attachment = {
  id: string;
  name: string;
  type: AttachmentType;
  url: string;
  size: number;
  mimeType: MimeType;
  downloadable: boolean;
  uploadedAt: Date;
  uploadedBy?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  meta?: Record<string, any>;
};

export type EmailNotification = {
  channel: "email";
  provider: "nodemailer";
  template?: EmailTemplates;
  attachments?: Attachment[];
};

export enum EmailProviders {
  NODEMAILER = "nodemailer",
}

export enum SmsProviders {
  TWILIO = "twilio",
  PAHAPPA = "pahappa",
}

export enum PushProviders {
  FIREBASE = "firebase",
  SOCKET = "socket",
}

export type FirebaseNotification = {
  provider: "firebase";
  options?: {
    fcm?:
      | { type: "topic"; topic: string }
      | { type: "condition"; condition: string };
    imageUrl?: string;
    androidChannelId?: string;
    androidIcon?: string;
    androidColor?: string;
    iosSound?: string;
    iosBadge?: number;
    ApnsPayload?: ApnsPayload;
    ApnsConfig?: ApnsConfig;
    WebpushConfig?: WebpushConfig;
    AndroidConfig?: AndroidConfig;
  };
};

export enum NotificationChannel {
  SMS = "sms",
  EMAIL = "email",
  PUSH = "push",
}

export type SocketNotification = {
  provider: "socket";
  options?: { event?: string; [key: string]: any };
  template?: PushTemplates;
  attachments?: Attachment[];
  coverImage?: string;
};

export type PushNotification = {
  channel: "push";
} & (SocketNotification | FirebaseNotification);

export type SmsNotification = {
  channel: "sms";
} & (
  | { provider: "twilio"; options?: Record<string, any> }
  | { provider: "pahappa"; options?: Record<string, any> }
);

export enum Priority {
  LOW = "low",
  HIGH = "high",
  NORMAL = "normal",
}

export enum Channel {
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
}

export enum MimeType {
  // Documents
  PDF = "application/pdf",
  WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  POWERPOINT = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  PLAIN_TEXT = "text/plain",
  HTML = "text/html",
  CSV = "text/csv",
  JSON = "application/json",
  XML = "application/xml",

  // Images
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  SVG = "image/svg+xml",
  WEBP = "image/webp",
  BMP = "image/bmp",

  // Audio
  MP3 = "audio/mpeg",
  WAV = "audio/wav",
  OGG = "audio/ogg",
  AAC = "audio/aac",

  // Video
  MP4 = "video/mp4",
  WEBM = "video/webm",
  OGV = "video/ogg",
  MOV = "video/quicktime",

  // Archives
  ZIP = "application/zip",
  TAR = "application/x-tar",
  GZIP = "application/gzip",
  RAR = "application/vnd.rar",

  // Other
  OCTET_STREAM = "application/octet-stream",
}

export enum AlertType {
  SYSTEM = "system",
  ERROR = "error",
  WARNING = "warning",
  SECURITY = "security",
  NETWORK = "network",
  PERFORMANCE = "performance",
  MAINTENANCE = "maintenance",
  CUSTOM = "custom",
  ANNOUCEMENT = "announcement",
}

export type Notification = {
  id?: string;
  to: string | string[];
  from: string;
  subject: string;
  body: string;
  expireDate?: Date;
  avatar?: {
    name: string;
    avatar?: string;
  };
  data?: Record<string, any>;
  alertType?: AlertType;
  priority?: Priority;
  scheduledAt?: Date;
  metadata?: {
    userId?: string;
    eventType?: string;
    maxRetries?: number;
    [key: string]: any;
  };
} & (EmailNotification | PushNotification | SmsNotification);

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
// result.interface.ts
export interface NotificationResult {
  status: NotificationStatus;
  messageId?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamps: {
    queuedAt?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
  };
  providerMetadata?: Record<string, any>;
}

export interface SuccessEvent {
  type: "complete";
  data: {
    notificationId: string;
    status: NotificationStatus;
    results: NotificationResult[];
  };
}
export interface ProgressEvent {
  type: "progress";
  data: NotificationResult;
}

export type NotificationEvent = SuccessEvent | ProgressEvent;

export type ExtractNotificationByChannel<
  T extends { [K in D]: string },
  D extends keyof T,
  V extends T[D]
> = T extends Record<D, V> ? T : never;

export type EmailNotificationType = ExtractNotificationByChannel<
  Notification,
  "channel",
  "email"
>;

export type SmsNotificationType = ExtractNotificationByChannel<
  Notification,
  "channel",
  "sms"
>;

export type PushNotificationType = ExtractNotificationByChannel<
  Notification,
  "channel",
  "push"
>;

export enum EventType {
  //Notification Events
  NOTIFICATION_CREATED = "NOTIFICATION_CREATED",
  NOTIFICATION_READ = "NOTIFICATION_READ",
  // System Events
  PROVIDER_SELECTED = "PROVIDER_SELECTED",
  PROVIDER_SWITCHED = "PROVIDER_SWITCHED",
  RATE_LIMIT_HIT = "RATE_LIMIT_HIT",
  RETRY_INITIATED = "RETRY_INITIATED",

  // Delivery Events
  RECIPIENT_PROCESSING = "RECIPIENT_PROCESSING",
  RECIPIENT_SUCCESS = "RECIPIENT_SUCCESS",
  RECIPIENT_FAILURE = "RECIPIENT_FAILURE",
  RECIPIENT_QUEUED = "RECIPIENT_QUEUED",
  RECIPIENT_RETRY_INITIATED = "RECIPIENT_RETRY_INITIATED",
  RECIPIENT_SCHEDULED_INITIATED = "RECIPIENT_SCHEDULED_INITIATED",

  // System Errors
  PROVIDER_ERROR = "PROVIDER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",

  // State Changes
  STATUS_CHANGE = "STATUS_CHANGE",
}

export enum EventSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export enum RecipientStatus {
  QUEUED = "queued",
  DELIVERED = "delivered",
  FAILED = "failed",
  RETRY = "retry",
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
}

export enum RecipientRead {
  READ = "read",
  UNREAD = "unread",
  // for untracked providers
  UNKNOWN = "unknown",
}
