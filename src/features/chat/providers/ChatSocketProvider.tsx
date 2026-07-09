"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useChatSocketToken } from "@/hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, ApiEnvelope } from "@/types";

type MessagesEnvelope = ApiEnvelope<ChatMessage[]> & {
  meta?: {
    nextCursor?: string | null;
    hasMore?: boolean;
  };
};

const CHAT_SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? null;

interface ChatSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  socketReady: boolean;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

const ChatSocketContext = createContext<ChatSocketContextType | null>(null);

export function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Get socket token if API URL is available
  const tokenQuery = useChatSocketToken(Boolean(CHAT_SOCKET_URL));
  const token = tokenQuery.data?.token;

  useEffect(() => {
    if (!CHAT_SOCKET_URL || !token) {
      return;
    }

    const socketInstance = io(`${CHAT_SOCKET_URL}/chat`, {
      transports: ["websocket"],
      auth: {
        token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      setSocket(socketInstance);
      setIsConnected(true);
      
      // If we already had an active conversation set, rejoin it
      if (activeConversationId) {
        socketInstance.emit("joinConversation", { conversationId: activeConversationId });
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    socketInstance.on("newMessage", (message: ChatMessage) => {
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
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token, queryClient]);

  // When active conversation ID changes, manage join/leave subscriptions
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (activeConversationId) {
      socket.emit("joinConversation", { conversationId: activeConversationId });
    }

    return () => {
      if (activeConversationId) {
        socket.emit("leaveConversation", { conversationId: activeConversationId });
      }
    };
  }, [activeConversationId, socket, isConnected]);

  return (
    <ChatSocketContext.Provider
      value={{
        socket,
        isConnected,
        socketReady: Boolean(token && CHAT_SOCKET_URL),
        activeConversationId,
        setActiveConversationId,
      }}
    >
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used within a ChatSocketProvider");
  }
  return context;
}
