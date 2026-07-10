"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { useContract } from "../../hooks/useContracts";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { useMessages, useSendMessage } from "@/features/chat/hooks/useMessages";
import { deriveDeliverablesFromMessages } from "../services/deliverable-service";
import type { Deliverable } from "../types";
import { Message } from "@/features/chat/types";

export function useDeliverables(contractId: string, options: { enabled?: boolean } = {}) {
  const contractQuery = useContract(contractId, { enabled: options.enabled });
  
  // Find conversation by context (contract) and reference ID
  const conversationsQuery = useConversations("CONTRACT", contractId);
  const conversation = conversationsQuery.data?.[0];
  const conversationId = conversation?.id;

  const messagesQuery = useMessages(conversationId as string);

  return useQuery<Deliverable[]>({
    queryKey: queryKeys.contracts.deliverables(contractId),
    queryFn: () => {
      if (!contractQuery.data || !messagesQuery.data) return [];
      
      // Flatten paginated messages
      const allMessages = messagesQuery.data.pages.flatMap((page) => page.messages) || [];
      
      // We pass the new domain Message to deriveDeliverablesFromMessages,
      // it might need adaptation, but the signature can accept any[] or Message[]
      return deriveDeliverablesFromMessages(contractQuery.data, allMessages as any[]);
    },
    enabled: Boolean(contractQuery.data) && Boolean(messagesQuery.data) && (options.enabled ?? true),
  });
}

export function useSubmitDeliverable(conversationId: string) {
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage(conversationId);

  return useMutation<
    unknown,
    Error,
    {
      contractId: string;
      content: string;
      file: File;
    }
  >({
    mutationFn: async ({ content, file }) => {
      // Create a temporary ID
      const tempId = `temp-${Date.now()}`;
      
      // In a real app, this should upload the file first then attach the URL to the message.
      // For now, we are simulating it and sending the text.
      return sendMessageMutation.mutateAsync({
        content: `[Deliverable Attached] ${content}`,
        type: "TEXT",
        tempId,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.deliverables(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
    },
  });
}
