export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedOrderId?: string | null;
  isRead: boolean;
  createdAt: string;
}
