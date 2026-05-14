"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { proxyFetch, proxyFetchEnvelope } from "@/proxy";
import type { ApiEnvelope, ChatConversation, ChatMessage } from "@/types";

const CHAT_SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? null;

type MessagesEnvelope = ApiEnvelope<ChatMessage[]> & {
  meta?: {
    nextCursor?: string | null;
    hasMore?: boolean;
  };
};

export function useContractConversation(contractId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<ChatConversation>({
    queryKey: ["chat", "conversation", contractId],
    queryFn: () => proxyFetch<ChatConversation>(`/chat/contracts/${contractId}/conversation`, { method: "POST" }),
    enabled: Boolean(contractId) && (options.enabled ?? true),
  });
}

export function useConversationMessages(conversationId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<MessagesEnvelope>({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => proxyFetchEnvelope<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`),
    enabled: Boolean(conversationId) && (options.enabled ?? true),
    refetchInterval: 15000,
  });
}

export function useChatSocketToken(enabled: boolean) {
  return useQuery<{ token: string }>({
    queryKey: ["chat", "socket-token"],
    queryFn: () => proxyFetch<{ token: string }>("/chat/socket-token", { method: "POST" }),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<
    ChatMessage,
    Error,
    {
      conversationId: string;
      content?: string;
      file?: File | null;
      fileUrl?: string;
      fileType?: string;
      fileName?: string;
      fileSize?: number;
    }
  >({
    mutationFn: async ({ conversationId, content, file, ...preUploaded }) => {
      let uploaded:
        | {
            fileUrl: string;
            fileType?: string | null;
            fileName?: string | null;
            fileSize?: number | null;
          }
        | undefined = preUploaded.fileUrl ? (preUploaded as any) : undefined;

      if (file && !uploaded) {
        const body = new FormData();
        body.append("file", file);
        uploaded = await proxyFetch<{
          fileUrl: string;
          fileType?: string | null;
          fileName?: string | null;
          fileSize?: number | null;
        }>("/upload", {
          method: "POST",
          body,
        });
      }

      return proxyFetch<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          content,
          type: uploaded ? resolveUploadType(uploaded.fileType) : "TEXT",
          ...uploaded,
        }),
      });
    },
    onSuccess: (message) => {
      queryClient.setQueryData<MessagesEnvelope | undefined>(
        ["chat", "messages", message.conversationId],
        (current) => {
          const items = current?.data ?? [];
          const exists = items.some((item) => item.id === message.id);
          return {
            ...current,
            data: exists ? items : [...items, message],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["chat", "conversation"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

function resolveUploadType(fileType?: string | null) {
  if (fileType?.startsWith("image/")) return "IMAGE";
  if (fileType?.startsWith("video/")) return "VIDEO";
  if (fileType?.startsWith("audio/")) return "AUDIO";
  return "FILE";
}

export function useConversationSocket(conversationId?: string, enabled = true) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const tokenQuery = useChatSocketToken(Boolean(conversationId) && enabled && Boolean(CHAT_SOCKET_URL));

  useEffect(() => {
    if (!conversationId || !enabled || !CHAT_SOCKET_URL || !tokenQuery.data?.token) {
      return;
    }

    const socket = io(`${CHAT_SOCKET_URL}/chat`, {
      transports: ["websocket"],
      auth: {
        token: tokenQuery.data.token,
      },
    });

    socket.on("connect", () => {
      setSocket(socket);
      setIsConnected(true);
      socket.emit("joinConversation", { conversationId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    socket.on("newMessage", (message: ChatMessage) => {
      queryClient.setQueryData<MessagesEnvelope | undefined>(
        ["chat", "messages", conversationId],
        (current) => {
          const items = current?.data ?? [];
          const exists = items.some((item) => item.id === message.id);
          return {
            ...current,
            data: exists ? items : [...items, message],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["chat", "conversation"] });
    });

    return () => {
      socket.emit("leaveConversation", { conversationId });
      socket.disconnect();
    };
  }, [conversationId, enabled, queryClient, tokenQuery.data?.token]);

  return {
    isConnected,
    socketReady: Boolean(tokenQuery.data?.token && CHAT_SOCKET_URL),
    socket,
  };
}
