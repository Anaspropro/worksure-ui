"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/queryKeys";
import { getMessages, sendMessage, markAsRead, PaginatedMessages } from "../services/chat-service";
import { Message, UserMessage } from "../types";

export function useMessages(conversationId: string) {
  return useInfiniteQuery<PaginatedMessages, Error>({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam = undefined }) => getMessages({ conversationId, cursor: pageParam as string | undefined }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, type, tempId }: { content: string; type: string; tempId: string }) => 
      sendMessage(conversationId, content, type, tempId),
    onMutate: async ({ content, type, tempId }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) });

      const previousMessages = queryClient.getQueryData(chatKeys.messages(conversationId));

      // Optimistic update
      queryClient.setQueryData(chatKeys.messages(conversationId), (old: any) => {
        if (!old) return old;
        
        const optimisticMessage: UserMessage = {
          id: tempId,
          conversationId,
          type: type as any,
          content,
          senderId: "current-user", // In a real app, this comes from auth context
          status: "SENDING",
          createdAt: new Date().toISOString(),
          actions: {},
        };

        // Prepend to the first page (assuming descending order)
        const newPages = [...old.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMessage, ...newPages[0].messages],
          };
        }

        return { ...old, pages: newPages };
      });

      return { previousMessages };
    },
    onError: (err, variables, context: any) => {
      // Revert optimistic update
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.messages(conversationId), context.previousMessages);
      }
    },
    onSettled: () => {
      // Don't invalidate immediately if we handle the response nicely, 
      // but let's do it to be safe for now, or let WebSockets handle it.
    },
    onSuccess: (newMessage, variables) => {
      // Replace optimistic message with actual message
      queryClient.setQueryData(chatKeys.messages(conversationId), (old: any) => {
        if (!old) return old;
        
        const newPages = old.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((msg: Message) => 
            msg.id === variables.tempId ? newMessage : msg
          ),
        }));

        return { ...old, pages: newPages };
      });
    }
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      markAsRead(conversationId, messageId),
  });
}
