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
