"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { AdminCollection, AdminContractStats, AdminDisputeRecord, AdminOverviewReport, AdminUserDetail, AdminUserRecord, Contract, Job, AuditLog, SystemLog, SystemHealth, ApiEnvelope, WalletTransaction } from "@/types";

export function useAdminUsers(params: { search?: string; role?: string; cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.search) query.search = params.search;
  if (params.role) query.role = params.role;
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<AdminCollection<AdminUserRecord>>({
    queryKey: ["admin", "users", params.search, params.role, params.cursor, params.limit],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/users", { params: { query } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminCollection<AdminUserRecord>;
    },
    enabled: params.enabled,
  });
}

export function useAdminDisputes(params: { cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<AdminCollection<AdminDisputeRecord>>({
    queryKey: ["admin", "disputes", params.cursor, params.limit],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/disputes", { params: { query } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminCollection<AdminDisputeRecord>;
    },
    enabled: params.enabled,
  });
}

export function useAdminReports(reportType = "overview", options: { enabled?: boolean } = {}) {
  return useQuery<AdminOverviewReport>({
    queryKey: ["admin", "reports", reportType],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/admin/reports?reportType=${reportType}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      // Backend returns { data: { reportType, totals }, exportFormats }
      const result = await response.json();
      return (result?.data ?? result) as AdminOverviewReport;
    },
    enabled: options.enabled,
  });
}

export function useAdminUserDetail(userId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<{ data: AdminUserDetail }>({
    queryKey: ["admin", "users", userId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/admin/users/${userId}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      return await response.json();
    },
    enabled: Boolean(userId) && (options.enabled ?? true),
  });
}

export function useVerifyArtisan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error, response } = await apiClient.PATCH("/admin/users/{id}/verify" as any, { params: { path: { id: userId } } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useRejectArtisanVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error, response } = await apiClient.PATCH("/admin/users/{id}/reject-verification" as any, { params: { path: { id: userId } } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error, response } = await apiClient.PATCH("/admin/users/{id}/ban" as any, { params: { path: { id: userId } } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error, response } = await apiClient.PATCH("/admin/users/{id}/unban" as any, { params: { path: { id: userId } } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useResolveAdminDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      disputeId,
      decision,
      notes,
    }: {
      disputeId: string;
      decision: "CLIENT_WINS" | "ARTISAN_WINS" | "SPLIT_DECISION";
      notes?: string;
    }) => {
      const { data, error, response } = await apiClient.PATCH("/admin/disputes/{id}/resolve" as any, {
        params: { path: { id: disputeId } },
        body: { decision, notes } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useAdminContracts(params: { search?: string; status?: string; cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<AdminCollection<Contract>>({
    queryKey: ["admin", "contracts", params.search, params.status, params.cursor, params.limit],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/contracts", { params: { query } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminCollection<Contract>;
    },
    enabled: params.enabled,
  });
}

export function useAdminContractStats(options: { enabled?: boolean } = {}) {
  return useQuery<AdminContractStats>({
    queryKey: ["admin", "contracts", "stats"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/contracts/stats");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminContractStats;
    },
    enabled: options.enabled,
  });
}

export function useAdminJobs(params: { search?: string; status?: string; cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<AdminCollection<Job>>({
    queryKey: ["admin", "jobs", params.search, params.status, params.cursor, params.limit],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/admin/jobs", { params: { query } });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as AdminCollection<Job>;
    },
    enabled: params.enabled,
  });
}

export function useAdminAuditLogs(params: { cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: ["admin", "audit", params.cursor, params.limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams(query as Record<string, string>).toString();
      const response = await fetch(`/api/proxy/admin/audit?${searchParams}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      // Backend returns { data: [...], meta: { ... } } — matches ApiEnvelope shape
      return await response.json() as ApiEnvelope<AuditLog[]>;
    },
    enabled: params.enabled,
  });
}

export function useAdminReconciliationReports(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<AuditLog[]>>({
    queryKey: ["admin", "reconciliation", page, limit],
    queryFn: async () => {
      // fallback to proxyFetch since we don't know the exact openapi endpoint
      const res = await fetch(`/api/proxy/admin/reconciliation/reports?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as unknown as ApiEnvelope<AuditLog[]>;
    },
    enabled: options.enabled,
  });
}

export function useTriggerReconciliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/proxy/admin/reconciliation/trigger`, { method: "POST" });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reconciliation"] });
    },
  });
}

export function useAdminSystemHealth(options: { enabled?: boolean; refetchInterval?: number } = {}) {
  return useQuery<SystemHealth>({
    queryKey: ["admin", "monitoring", "health"],
    queryFn: async () => {
      const response = await fetch("/api/proxy/admin/monitoring/health", { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      return await response.json();
    },
    enabled: options.enabled,
    refetchInterval: options.refetchInterval,
  });
}

export function useAdminSystemLogs(page = 1, limit = 20, options: { enabled?: boolean } = {}) {
  return useQuery<ApiEnvelope<SystemLog[]>>({
    queryKey: ["admin", "monitoring", "logs", page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/admin/monitoring/logs?page=${page}&limit=${limit}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      return await response.json();
    },
    enabled: options.enabled,
  });
}

export function useClearSystemLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error, response } = await apiClient.DELETE("/admin/monitoring/logs" as any, {});
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "monitoring", "logs"] });
    },
    onError: (error: Error) => {
      console.error("Failed to clear logs:", error);
      alert(`Failed to clear logs: ${error.message}. If the server was just updated, please ensure the backend is restarted.`);
    }
  });
}

export function useAdminTransactions(params: { type?: string; cursor?: string; limit?: number; enabled?: boolean } = {}) {
  const query: any = {};
  if (params.type) query.type = params.type;
  if (params.cursor) query.cursor = params.cursor;
  if (params.limit) query.limit = params.limit;

  return useQuery<AdminCollection<WalletTransaction>>({
    queryKey: ["admin", "transactions", params.type, params.cursor, params.limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams(query as Record<string, string>).toString();
      const response = await fetch(`/api/proxy/admin/transactions?${searchParams}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      // Backend returns { data: [...], meta: { total, nextCursor, ... } } — matches AdminCollection shape directly
      return await response.json() as AdminCollection<WalletTransaction>;
    },
    enabled: params.enabled,
  });
}

export function useAdminProcessPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const { data, error, response } = await apiClient.POST("/wallet/payout/process" as any, {
        body: { transactionId } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}
