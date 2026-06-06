"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/api-client";
import type { AdminCollection, AdminContractStats, AdminDisputeRecord, AdminOverviewReport, AdminUserDetail, AdminUserRecord, Contract, Job, AuditLog, SystemLog, SystemHealth, ReconciliationReport, ApiEnvelope, WalletTransaction } from "@/types";
import { getAuditLogs, getReconciliationReports, triggerReconciliation, getSystemHealth, getSystemLogs } from "@/api-client";

export function useAdminUsers(options: { enabled?: boolean } = {}) {
  return useQuery<AdminCollection<AdminUserRecord>>({
    queryKey: ["admin", "users"],
    queryFn: () => proxyFetchRaw<AdminCollection<AdminUserRecord>>("/admin/users"),
    enabled: options.enabled,
  });
}

export function useAdminDisputes(options: { enabled?: boolean } = {}) {
  return useQuery<AdminCollection<AdminDisputeRecord>>({
    queryKey: ["admin", "disputes"],
    queryFn: () => proxyFetchRaw<AdminCollection<AdminDisputeRecord>>("/admin/disputes"),
    enabled: options.enabled,
  });
}

export function useAdminReports(reportType = "overview", options: { enabled?: boolean } = {}) {
  return useQuery<AdminOverviewReport>({
    queryKey: ["admin", "reports", reportType],
    queryFn: () => proxyFetch<AdminOverviewReport>(`/admin/reports?reportType=${reportType}`),
    enabled: options.enabled,
  });
}

export function useAdminUserDetail(userId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<{ data: AdminUserDetail }>({
    queryKey: ["admin", "users", userId],
    queryFn: () => proxyFetchRaw<{ data: AdminUserDetail }>(`/admin/users/${userId}`),
    enabled: Boolean(userId) && (options.enabled ?? true),
  });
}

export function useVerifyArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      proxyFetch(`/admin/users/${userId}/verify`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      proxyFetch(`/admin/users/${userId}/ban`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      proxyFetch(`/admin/users/${userId}/unban`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useResolveAdminDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      disputeId,
      decision,
      notes,
    }: {
      disputeId: string;
      decision: "REFUND_CLIENT" | "PAY_ARTISAN";
      notes?: string;
    }) =>
      proxyFetch(`/admin/disputes/${disputeId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ decision, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useAdminContracts(status?: string, options: { enabled?: boolean } = {}) {
  const queryKey = status ? ["admin", "contracts", status] : ["admin", "contracts"];
  const url = status ? `/admin/contracts?status=${status}` : "/admin/contracts";

  return useQuery<AdminCollection<Contract>>({
    queryKey,
    queryFn: () => proxyFetchRaw<AdminCollection<Contract>>(url),
    enabled: options.enabled,
  });
}

export function useAdminContractStats(options: { enabled?: boolean } = {}) {
  return useQuery<AdminContractStats>({
    queryKey: ["admin", "contracts", "stats"],
    queryFn: () => proxyFetch<AdminContractStats>("/admin/contracts/stats"),
    enabled: options.enabled,
  });
}

export function useAdminJobs(status?: string, options: { enabled?: boolean } = {}) {
  const queryKey = status ? ["admin", "jobs", status] : ["admin", "jobs"];
  const url = status ? `/admin/jobs?status=${status}` : "/admin/jobs";

  return useQuery<AdminCollection<Job>>({
    queryKey,
    queryFn: () => proxyFetchRaw<AdminCollection<Job>>(url),
    enabled: options.enabled,
  });
}

export function useAdminAuditLogs(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: ["admin", "audit", page, limit],
    queryFn: () => getAuditLogs(page, limit),
    enabled: options.enabled,
  });
}

export function useAdminReconciliationReports(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: ["admin", "reconciliation", page, limit],
    queryFn: () => getReconciliationReports(page, limit),
    enabled: options.enabled,
  });
}

export function useTriggerReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => triggerReconciliation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reconciliation"] });
    },
  });
}

export function useAdminSystemHealth(options: { enabled?: boolean; refetchInterval?: number } = {}) {
  return useQuery<SystemHealth>({
    queryKey: ["admin", "monitoring", "health"],
    queryFn: () => getSystemHealth(),
    enabled: options.enabled,
    refetchInterval: options.refetchInterval,
  });
}

export function useAdminSystemLogs(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<SystemLog[]>>({
    queryKey: ["admin", "monitoring", "logs", page, limit],
    queryFn: () => getSystemLogs(page, limit),
    enabled: options.enabled,
  });
}

export function useAdminTransactions(type?: string, options: { enabled?: boolean } = {}) {
  const queryKey = type ? ["admin", "transactions", type] : ["admin", "transactions"];
  const url = type ? `/admin/transactions?type=${type}` : "/admin/transactions";

  return useQuery<AdminCollection<WalletTransaction>>({
    queryKey,
    queryFn: () => proxyFetchRaw<AdminCollection<WalletTransaction>>(url),
    enabled: options.enabled,
  });
}

export function useAdminProcessPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      proxyFetch("/wallet/payout/process", {
        method: "POST",
        body: JSON.stringify({ transactionId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}
