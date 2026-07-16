import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
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
      const response = await apiClient.get<{ data: AdminOverviewReport }>("/admin/reports?reportType=overview");
      return response.data.data;
    },
  });
}

export function useAdminReport<T = any>(type: string, month?: string) {
  return useQuery({
    queryKey: adminKeys.report(type, month),
    queryFn: async () => {
      const response = await apiClient.get<{ data: T }>(`/admin/reports`, { 
        params: { reportType: type, month } 
      });
      return response.data.data;
    },
  });
}

export function useAdminContractStats() {
  return useQuery({
    queryKey: adminKeys.contractStats(),
    queryFn: async () => {
      const response = await apiClient.get<AdminContractStats>("/admin/contracts/stats");
      return response.data;
    },
  });
}

export function useAdminUsers(params?: { search?: string, role?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.users(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<AdminUserRecord>>("/admin/users", { params });
      return response.data;
    },
  });
}

export function useAdminJobs(params?: { search?: string, status?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.jobs(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<any>>("/admin/jobs", { params });
      return response.data;
    },
  });
}

export function useAdminContracts(params?: { search?: string, status?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.contracts(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<any>>("/admin/contracts", { params });
      return response.data;
    },
  });
}

export function useAdminDisputes(params?: { cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.disputes(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<AdminDisputeRecord>>("/admin/disputes", { params });
      return response.data;
    },
  });
}

export function useAdminTransactions(params?: { type?: string, cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.transactions(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<WalletTransaction>>("/admin/transactions", { params });
      return response.data;
    },
  });
}

export function useAdminAuditLogs(params?: { cursor?: string, limit?: number }) {
  return useQuery({
    queryKey: [...adminKeys.auditLogs(), params],
    queryFn: async () => {
      const response = await apiClient.get<AdminCollection<AuditLog>>("/admin/audit-logs", { params });
      return response.data;
    },
  });
}

export function useSystemConfig() {
  return useQuery({
    queryKey: adminKeys.config(),
    queryFn: async () => {
      const response = await apiClient.get<{ data: Array<{ key: string, value: any, description: string | null }> }>("/admin/config");
      return response.data.data;
    },
  });
}

// Mutations
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidateUserQueries = () => {
    queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
  };

  const banUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/admin/users/${userId}/ban`);
      return response.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const unbanUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/admin/users/${userId}/unban`);
      return response.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const verifyArtisan = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/admin/users/${userId}/verify`);
      return response.data;
    },
    onSuccess: invalidateUserQueries,
  });

  const rejectArtisanVerification = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/admin/users/${userId}/reject-verification`);
      return response.data;
    },
    onSuccess: invalidateUserQueries,
  });

  return { banUser, unbanUser, verifyArtisan, rejectArtisanVerification };
}

export function useAdminJobMutations() {
  const queryClient = useQueryClient();

  const forceCloseJob = useMutation({
    mutationFn: async ({ jobId, reason }: { jobId: string; reason?: string }) => {
      const response = await apiClient.patch(`/admin/jobs/${jobId}/force-close`, { reason });
      return response.data;
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
      const response = await apiClient.patch(`/admin/disputes/${disputeId}/resolve`, { decision, notes });
      return response.data;
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
      const response = await apiClient.patch(`/admin/config/${key}`, { value, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.config() });
    },
  });

  return { updateConfig };
}
