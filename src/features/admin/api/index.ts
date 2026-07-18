import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import type {
  AdminOverviewReport,
  AdminContractStats,
  AdminCollection,
  AdminUserRecord,
  AdminDisputeRecord,
  AuditLog,
  WalletTransaction
} from "@/shared/types";

export const adminKeys = {
  all: ["admin"] as const,
  reports: () => [...adminKeys.all, "reports"] as const,
  overviewReport: () => [...adminKeys.reports(), "overview"] as const,
  report: (type: string, month?: string) => [...adminKeys.reports(), type, month] as const,
  contractStats: () => [...adminKeys.all, "contractStats"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  jobs: () => [...adminKeys.all, "jobs"] as const,
  contracts: () => [...adminKeys.all, "contracts"] as const,
  disputes: () => [...adminKeys.all, "disputes"] as const,
  auditLogs: () => [...adminKeys.all, "auditLogs"] as const,
  transactions: () => [...adminKeys.all, "transactions"] as const,
  config: () => [...adminKeys.all, "config"] as const,
};

export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overviewReport(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/reports", {
        params: { query: { reportType: 'overview' } }
      });
      if (error) throw error;
      return (data as any)?.data as AdminOverviewReport;
    },
  });
}

export function useAdminReport<T = any>(type: string, month?: string) {
  return useQuery({
    queryKey: adminKeys.report(type, month),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/reports", {
        params: { query: { reportType: type, month } }
      });
      if (error) throw error;
      return (data as any)?.data as unknown as T;
    },
  });
}

export function useAdminContractStats() {
  return useQuery({
    queryKey: adminKeys.contractStats(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/contracts/stats");
      if (error) throw error;
      return (data as any)?.data as unknown as AdminContractStats;
    },
  });
}

export function useAdminUsers(params?: { search?: string, role?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.users(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/users", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<AdminUserRecord>;
    },
  });
}

export function useAdminJobs(params?: { search?: string, status?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.jobs(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/jobs", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<any>;
    },
  });
}

export function useAdminContracts(params?: { search?: string, status?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.contracts(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/contracts", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<any>;
    },
  });
}

export function useAdminDisputes(params?: { cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.disputes(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/disputes", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<AdminDisputeRecord>;
    },
  });
}

export function useAdminTransactions(params?: { type?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.transactions(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/transactions", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<WalletTransaction>;
    },
  });
}

export function useAdminAuditLogs(params?: { cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.auditLogs(), params],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/audit-logs", { 
        params: { query: { ...params, limit: params?.limit?.toString() } as any } 
      });
      if (error) throw error;
      return data as unknown as AdminCollection<AuditLog>;
    },
  });
}

export function useSystemConfig() {
  return useQuery({
    queryKey: adminKeys.config(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/config" as any, {});
      if (error) throw error;
      return (data as any)?.data as unknown as Array<{ key: string, value: any, description: string | null }>;
    },
  });
}

// Mutations
export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidateUserQueries = () => {
    queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
  };

  const banUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await apiClient.PATCH("/admin/users/{id}/ban", {
        params: { path: { id: userId } }
      });
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const unbanUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await apiClient.PATCH("/admin/users/{id}/unban", {
        params: { path: { id: userId } }
      });
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const verifyArtisan = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await apiClient.PATCH("/admin/users/{id}/verify", {
        params: { path: { id: userId } }
      });
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const rejectArtisanVerification = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await apiClient.PATCH("/admin/users/{id}/reject-verification", {
        params: { path: { id: userId } }
      });
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: invalidateUserQueries,
  });

  return { banUser, unbanUser, verifyArtisan, rejectArtisanVerification };
}

export function useAdminJobMutations() {
  const queryClient = useQueryClient();

  const forceCloseJob = useMutation({
    mutationFn: async ({ jobId, reason }: { jobId: string; reason?: string }) => {
      const { data, error } = await apiClient.PATCH("/admin/jobs/{id}/force-close", {
        params: { path: { id: jobId } },
        body: { reason }
      } as any);
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
    },
  });

  return { forceCloseJob };
}

export function useAdminDisputeMutations() {
  const queryClient = useQueryClient();

  const resolveDispute = useMutation({
    mutationFn: async ({ disputeId, decision, notes }: { disputeId: string; decision: string; notes?: string }) => {
      const { data, error } = await apiClient.PATCH("/admin/disputes/{id}/resolve", {
        params: { path: { id: disputeId } },
        body: { decision, notes }
      } as any);
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.disputes() });
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
      queryClient.invalidateQueries({ queryKey: adminKeys.contractStats() });
    },
  });

  return { resolveDispute };
}

export function useAdminConfigMutations() {
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      const { data, error } = await apiClient.PATCH("/admin/config/{key}" as any, {
        params: { path: { key } },
        body: { value, description }
      } as any);
      if (error) throw error;
      return (data as any)?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.config() });
    },
  });

  return { updateConfig };
}
export * from './useAdminReviews';
