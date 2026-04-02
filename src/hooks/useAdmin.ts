"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/proxy";
import type { AdminCollection, AdminDisputeRecord, AdminUserRecord } from "@/types";

export function useAdminUsers() {
  return useQuery<AdminCollection<AdminUserRecord>>({
    queryKey: ["admin", "users"],
    queryFn: () => proxyFetchRaw<AdminCollection<AdminUserRecord>>("/admin/users"),
  });
}

export function useAdminDisputes() {
  return useQuery<AdminCollection<AdminDisputeRecord>>({
    queryKey: ["admin", "disputes"],
    queryFn: () => proxyFetchRaw<AdminCollection<AdminDisputeRecord>>("/admin/disputes"),
  });
}

export function useAdminReports(reportType = "overview") {
  return useQuery<Record<string, unknown>>({
    queryKey: ["admin", "reports", reportType],
    queryFn: () => proxyFetchRaw<Record<string, unknown>>(`/admin/reports?reportType=${reportType}`),
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
