"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/queryKeys";
import { getConversations, getConversation } from "../services/chat-service";
import { Conversation } from "../types";

export function useConversations(context?: string, contextReferenceId?: string) {
  return useQuery<Conversation[], Error>({
    queryKey: [...chatKeys.conversations(), { context, contextReferenceId }],
    queryFn: () => getConversations(context, contextReferenceId),
  });
}

export function useConversation(id: string) {
  return useQuery<Conversation, Error>({
    queryKey: chatKeys.conversation(id),
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}
