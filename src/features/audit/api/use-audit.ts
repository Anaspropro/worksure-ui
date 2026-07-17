import apiClient from "@/shared/api/client";
import { useQuery } from "@tanstack/react-query";

interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  domain?: string;
  actorType?: string;
  targetType?: string;
  actorId?: string;
}

export const useAuditLogs = (params: GetAuditLogsParams) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: async () => {
      // For now, since apiClient doesn't have the updated OpenAPI types for /admin/audit yet,
      // we can use a typed manual fetch or rely on apiClient generic casting if it allows it.
      // Assuming apiClient supports arbitrary paths with casting for newly added routes:
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.domain) queryParams.append("domain", params.domain);
      if (params.actorType) queryParams.append("actorType", params.actorType);
      if (params.targetType) queryParams.append("targetType", params.targetType);
      if (params.actorId) queryParams.append("actorId", params.actorId);

      // Cast as any because openapi-fetch schema might not be updated
      const { data, error } = await (apiClient as any).GET(`/admin/audit?${queryParams.toString()}`);
      if (error) throw error;
      return data;
    },
  });
};

export const useAuditTimeline = (targetType: string, targetId: string) => {
  return useQuery({
    queryKey: ["audit-timeline", targetType, targetId],
    queryFn: async () => {
      const { data, error } = await (apiClient as any).GET(`/admin/audit/timeline/${targetType}/${targetId}`);
      if (error) throw error;
      return data;
    },
    enabled: !!targetType && !!targetId,
  });
};
