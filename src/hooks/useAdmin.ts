"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/proxy";
import type { AdminCollection, AdminContractStats, AdminDisputeRecord, AdminOverviewReport, AdminUserDetail, AdminUserRecord, Contract, Job } from "@/types";

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
