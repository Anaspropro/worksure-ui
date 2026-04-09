"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/proxy";
import type { AdminCollection, AdminDisputeRecord, AdminOverviewReport, AdminUserDetail, AdminUserRecord } from "@/types";

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
