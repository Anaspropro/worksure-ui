"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { TypingIndicator } from "../types";
import { useChatSocket } from "./useChatSocket";

const TYPING_TIMEOUT = 3000;

export function useTyping(conversationId: string, currentUserId: string) {
  const socket = useChatSocket();
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingIndicator>>({});
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Throttle emitting typing indicator
  const lastEmitTime = useRef(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleTypingStarted = (indicator: TypingIndicator) => {
      if (indicator.conversationId !== conversationId) return;
      if (indicator.userId === currentUserId) return;

      setTypingUsers(prev => ({ ...prev, [indicator.userId]: indicator }));

      // Clear existing timeout
      if (typingTimeouts.current[indicator.userId]) {
        clearTimeout(typingTimeouts.current[indicator.userId]);
      }

      // Auto-clear typing indicator after timeout
      typingTimeouts.current[indicator.userId] = setTimeout(() => {
        setTypingUsers(prev => {
          const next = { ...prev };
          delete next[indicator.userId];
          return next;
        });
      }, TYPING_TIMEOUT);
    };

    const handleTypingStopped = (indicator: Omit<TypingIndicator, "startedAt">) => {
      if (indicator.conversationId !== conversationId) return;

      if (typingTimeouts.current[indicator.userId]) {
        clearTimeout(typingTimeouts.current[indicator.userId]);
      }

      setTypingUsers(prev => {
        const next = { ...prev };
        delete next[indicator.userId];
        return next;
      });
    };

    socket.on("typing:started", handleTypingStarted);
    socket.on("typing:stopped", handleTypingStopped);

    return () => {
      socket.off("typing:started", handleTypingStarted);
      socket.off("typing:stopped", handleTypingStopped);
    };
  }, [socket, conversationId, currentUserId]);

  const emitTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastEmitTime.current > 2000) {
      socket?.emit("typing:start", conversationId);
      lastEmitTime.current = now;
      setIsTyping(true);
      
      // Auto-stop our own typing
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  }, [socket, conversationId]);

  return {
    typingUsers: Object.values(typingUsers),
    emitTyping,
    isTyping
  };
}
