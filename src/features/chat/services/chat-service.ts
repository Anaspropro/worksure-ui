import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
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
  const { data, error, response } = await apiClient.GET("/chat/conversations", {
    params: {
      query: { context, contextReferenceId } as any
    }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as Conversation[];
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await fetch(`/api/proxy/chat/conversations/${id}`, { cache: "no-store" });
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch (e) {}
    throw new ApiError(response.statusText, response.status, errorData);
  }
  // Backend returns { data: conversation }
  const result = await response.json();
  return (result?.data ?? result) as Conversation;
}

export async function getMessages({ conversationId, cursor, limit = 50 }: GetMessagesParams): Promise<PaginatedMessages> {
  const { data, error, response } = await apiClient.GET("/chat/conversations/{conversationId}/messages", {
    params: {
      path: { conversationId },
      query: { cursor, limit } as any
    }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  const result = data as any;
  return {
    messages: result?.data ?? [],
    nextCursor: result?.pagination?.nextCursor,
    hasMore: result?.pagination?.hasMore ?? false,
  };
}

export async function sendMessage(conversationId: string, content: string, type: string, tempId: string): Promise<Message> {
  const { data, error, response } = await apiClient.POST("/chat/conversations/{conversationId}/messages", {
    params: { path: { conversationId } },
    body: { content, type, tempId } as any
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return (data as any)?.data as unknown as Message;
}

export async function markAsRead(conversationId: string, messageId: string): Promise<void> {
  const { error, response } = await apiClient.POST("/chat/conversations/{conversationId}/messages/{messageId}/read" as any, {
    params: { path: { conversationId, messageId } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
}
