// Legacy api-client.ts wrapper. Core logic resides in src/shared/api/fetcher.ts.
// Admin endpoints are kept here for backward compatibility until the Admin feature is fully migrated.

import { proxyFetch, proxyFetchRaw } from "@/shared/api/fetcher";
import type { ApiEnvelope, AuditLog, SystemLog, SystemHealth, ReconciliationReport } from "@/types";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";

export * from "@/shared/api/fetcher";

export async function getAuditLogs(page = 1, limit = 20): Promise<ApiEnvelope<AuditLog[]>> {
  const { data, response } = await apiClient.GET("/admin/audit", {
    params: {
      query: {
        page: String(page),
        limit: String(limit),
      } as unknown as { page: string; limit: string; entityType: string; performedBy: string }
    }
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return data as unknown as ApiEnvelope<AuditLog[]>;
}

export async function getReconciliationReports(page = 1, limit = 20): Promise<ApiEnvelope<AuditLog[]>> {
  const { data, response } = await apiClient.GET("/admin/reconciliation/reports", {
    params: { query: { page: String(page), limit: String(limit) } }
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return data as unknown as ApiEnvelope<AuditLog[]>;
}

export async function triggerReconciliation(): Promise<ReconciliationReport> {
  const { data, response } = await apiClient.POST("/admin/reconciliation/trigger");
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return data as unknown as ReconciliationReport;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const { data, response } = await apiClient.GET("/admin/monitoring/health");
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return data as unknown as SystemHealth;
}

export async function getSystemLogs(page = 1, limit = 20): Promise<ApiEnvelope<SystemLog[]>> {
  const { data, response } = await apiClient.GET("/admin/monitoring/logs", {
    params: {
      query: {
        page: String(page),
        limit: String(limit),
      } as unknown as { page: string; limit: string; level: string; context: string }
    }
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return data as unknown as ApiEnvelope<SystemLog[]>;
}
