"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { financialQueryKeys } from "../../shared/utils/queryKeys";
import type { AdminCollection, WalletTransaction, ApiEnvelope, AuditLog } from "@/types";

export function useAdminPayoutRequests(params: { cursor?: string; limit?: number; enabled?: boolean } = {}) {
  return useQuery<AdminCollection<WalletTransaction>>({
    queryKey: [...financialQueryKeys.adminPayouts(), params.cursor, params.limit],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/transactions", {
        params: {
          query: {
            type: "PAYOUT",
            cursor: params.cursor,
            limit: params.limit,
          } as any
        }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminCollection<WalletTransaction>;
    },
    enabled: params.enabled,
  });
}

export function useProcessPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const { data, error, response } = await apiClient.POST("/wallet/payout/process", {
        body: { transactionId } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.adminPayouts() });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] }); // Global admin stats
    },
  });
}

export function useReconciliationReports(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: [...financialQueryKeys.adminReconciliation(), page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/proxy/admin/reconciliation?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as unknown as ApiEnvelope<AuditLog[]>;
    },
    enabled: options.enabled,
  });
}

export function useRunReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/proxy/admin/reconciliation/trigger`, { method: "POST" });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.adminReconciliation() });
    },
  });
}
