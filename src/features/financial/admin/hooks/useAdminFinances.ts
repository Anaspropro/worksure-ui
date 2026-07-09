"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw, getReconciliationReports, triggerReconciliation } from "@/api-client";
import { financialQueryKeys } from "../../shared/utils/queryKeys";
import type { AdminCollection, WalletTransaction, ApiEnvelope, AuditLog } from "@/types";

export function useAdminPayoutRequests(params: { cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query = new URLSearchParams();
  query.set("type", "PAYOUT");
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit) query.set("limit", params.limit.toString());
  const queryString = query.toString() ? `?${query.toString()}` : "";

  return useQuery<AdminCollection<WalletTransaction>>({
    queryKey: [...financialQueryKeys.adminPayouts(), params.cursor, params.limit],
    queryFn: () => proxyFetchRaw<AdminCollection<WalletTransaction>>(`/admin/transactions${queryString}`),
    enabled: params.enabled,
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      proxyFetch("/wallet/payout/process", {
        method: "POST",
        body: JSON.stringify({ transactionId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.adminPayouts() });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] }); // Global admin stats
    },
  });
}

export function useReconciliationReports(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: [...financialQueryKeys.adminReconciliation(), page, limit],
    queryFn: () => getReconciliationReports(page, limit),
    enabled: options.enabled,
  });
}

export function useRunReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => triggerReconciliation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.adminReconciliation() });
    },
  });
}
