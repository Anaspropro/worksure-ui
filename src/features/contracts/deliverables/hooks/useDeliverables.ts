"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { useContract } from "../../hooks/useContracts";
import { useContractConversation, useConversationMessages, useSendMessage } from "@/hooks/useChat";
import { deriveDeliverablesFromMessages } from "../services/deliverable-service";
import type { Deliverable } from "../types";

export function useDeliverables(contractId: string, options: { enabled?: boolean } = {}) {
  const contractQuery = useContract(contractId, { enabled: options.enabled });
  const conversationQuery = useContractConversation(contractId, { enabled: options.enabled });
  
  const conversationId = conversationQuery.data?.id;
  const messagesQuery = useConversationMessages(conversationId, {
    enabled: Boolean(conversationId) && (options.enabled ?? true),
  });

  return useQuery<Deliverable[]>({
    queryKey: queryKeys.contracts.deliverables(contractId),
    queryFn: () => {
      if (!contractQuery.data || !messagesQuery.data) return [];
      const messages = messagesQuery.data.data ?? [];
      return deriveDeliverablesFromMessages(contractQuery.data, messages);
    },
    enabled: Boolean(contractQuery.data) && Boolean(messagesQuery.data),
  });
}

export function useSubmitDeliverable() {
  const queryClient = useQueryClient();
  const sendMessageMutation = useSendMessage();

  return useMutation<
    unknown,
    Error,
    {
      contractId: string;
      conversationId: string;
      content: string;
      file: File;
    }
  >({
    mutationFn: async ({ conversationId, content, file }) => {
      return sendMessageMutation.mutateAsync({
        conversationId,
        content,
        file,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.deliverables(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
    },
  });
}
