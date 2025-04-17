export type NotificationType = "NEW_MESSAGE" | "OTHER_TYPES_LATER";

export interface NotificationPayload {
  type: NotificationType;
  roomId: string;
  roomName?: string;
  content: string;
  fromUserId?: string;
  fromUsername?: string;
  createdAt?: string;
  messageId?: string;
  message: string;
  isRead: boolean;
}
export interface Notification {
  id: string;
  userId: string;
  user: Partial<User>;
  roomId: string;
  room: Partial<Room>;
  type: string;
  message: Partial<Message>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string | null;
}
