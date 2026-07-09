"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import * as contractService from "../../services/contract-service";
import type { Contract, AdminContractStats, AdminCollection } from "@/types";

export function useAdminContracts(
  params: contractService.AdminContractsFilter = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery<AdminCollection<Contract>>({
    queryKey: queryKeys.admin.contracts(params),
    queryFn: () => contractService.getAdminContracts(params),
    enabled: options.enabled,
  });
}

export function useAdminContractStats(options: { enabled?: boolean } = {}) {
  return useQuery<AdminContractStats>({
    queryKey: ["admin", "contracts", "stats"],
    queryFn: () => contractService.getAdminContractStats(),
    enabled: options.enabled,
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  
  return useMutation<
    unknown,
    Error,
    { disputeId: string; decision: string; notes?: string; contractId?: string }
  >({
    mutationFn: ({ disputeId, decision, notes }) =>
      contractService.resolveDispute(disputeId, decision, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.disputes({}) });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      if (variables.contractId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.contractId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
      }
    },
  });
}
