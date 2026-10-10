export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'user' | 'admin';
  senderId: string;
  messageText?: string | null;
  imageAttachment?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  adminId?: string | null;
  lastMessageAt?: string | null;
  admin?: { id?: string; name: string } | null;
}
