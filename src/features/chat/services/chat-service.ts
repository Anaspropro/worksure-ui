import { proxyFetch } from "@/shared/api/fetcher";
import { Conversation, Message } from "../types";

export interface GetMessagesParams {
  conversationId: string;
  cursor?: string;
  limit?: number;
}

export interface PaginatedMessages {
  messages: Message[];
  nextCursor?: string;
  hasMore: boolean;
}

export async function getConversations(context?: string, contextReferenceId?: string): Promise<Conversation[]> {
  const query = new URLSearchParams();
  if (context) query.append("context", context);
  if (contextReferenceId) query.append("contextReferenceId", contextReferenceId);
  
  const queryString = query.toString();
  return proxyFetch<Conversation[]>(`/chat/conversations${queryString ? `?${queryString}` : ""}`);
}

export async function getConversation(id: string): Promise<Conversation> {
  return proxyFetch<Conversation>(`/chat/conversations/${id}`);
}

export async function getMessages({ conversationId, cursor, limit = 50 }: GetMessagesParams): Promise<PaginatedMessages> {
  const query = new URLSearchParams();
  if (cursor) query.append("cursor", cursor);
  query.append("limit", limit.toString());
  
  return proxyFetch<PaginatedMessages>(`/chat/conversations/${conversationId}/messages?${query.toString()}`);
}

export async function sendMessage(conversationId: string, content: string, type: string, tempId: string): Promise<Message> {
  return proxyFetch<Message>(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content, type, tempId }),
  });
}

export async function markAsRead(conversationId: string, messageId: string): Promise<void> {
  return proxyFetch<void>(`/chat/conversations/${conversationId}/messages/${messageId}/read`, {
    method: "POST",
  });
}
