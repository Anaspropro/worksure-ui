"use client";

import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/queryKeys";
import { ServerToClientEvents, ClientToServerEvents, Message, Conversation } from "../types";

type ChatSocket = ReturnType<typeof io>;

export function useChatSocket() {
  const queryClient = useQueryClient();
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket namespace
    const socket = io(process.env.NEXT_PUBLIC_API_URL + "/chat", {
      autoConnect: true,
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Chat Socket connected:", socket.id);
    });

    socket.on("message:created", (message: Message) => {
      const { conversationId } = message;
      
      // We append the message to the cached list
      queryClient.setQueryData(chatKeys.messages(conversationId), (old: any) => {
        if (!old || old.pages.length === 0) return old;

        // Ensure we don't duplicate if it was already optimistically added
        const isDuplicate = old.pages.some((p: any) => p.messages.some((m: Message) => m.id === message.id));
        if (isDuplicate) return old;

        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          messages: [message, ...newPages[0].messages],
        };

        return { ...old, pages: newPages };
      });

      // Optionally invalidate or update the conversation to reflect unread count
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    });

    socket.on("conversation:updated", (conversation: Conversation) => {
      queryClient.setQueryData(chatKeys.conversation(conversation.id), conversation);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return socketRef.current;
}
