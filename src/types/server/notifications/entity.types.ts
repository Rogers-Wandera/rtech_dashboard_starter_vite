import { IBaseTableType } from "../server.main.types";
import {
  EventSeverity,
  EventType,
  Notification,
  NotificationChannel,
  NotificationResult,
  NotificationStatus,
  Priority,
  RecipientRead,
  RecipientStatus,
} from "./notification.types";

export interface NotificationEntity extends IBaseTableType {
  id: string;
  channel: NotificationChannel;
  events: NotificationEventEntity[];
  status: NotificationStatus;
  data: Notification;
  subject: string;
  sender: string;
  scheduledAt?: Date;
  completedAt?: Date;
  recipients: NotificationRecipient[];
  expireDate?: Date;
  seenBy?: string[];
}

export interface NotificationRecipient extends IBaseTableType {
  id: string;
  notification: NotificationEntity;
  recipientAddress: string;
  status: RecipientStatus;
  retryCount: number;
  maxRetries: number;
  messageId?: string;
  lastAttemptAt?: Date;
  queuedAt: Date;
  scheduledAt?: Date;
  deliveredAt?: Date;
  error?: NotificationResult["error"];
  providerDetails?: NotificationResult["providerMetadata"];
  priority: Priority;
  metadata?: Record<string, any>;
  nextAttemptAt?: Date;
  readStatus: RecipientRead;
  readAt?: Date;
}

export interface NotificationEventEntity extends IBaseTableType {
  id: string;
  notification: NotificationEntity;
  type: EventType;
  severity: EventSeverity;
  message: string;
  context: {
    recipient?: string;
    provider?: string;
    errorCode?: string;
    attempt?: number;
    statusBefore?: string;
    statusAfter?: string;
  };
}
