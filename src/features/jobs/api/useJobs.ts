"use client";

import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { ApiPagination, Job, JobStatus, UserRole } from "@/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { JobEvent } from "../types";

export type JobsQuery = {
  status?: JobStatus | string;
  clientId?: string;
  artisanId?: string;
  category?: string;
  search?: string;
  cursor?: string;
  limit?: number;
};

export type JobsResponse = {
  jobs?: Job[];
  data?: Job[];
  pagination: ApiPagination;
};

export function useJobs(params: JobsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", params],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/jobs", {
        params: { query: params as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as JobsResponse;
    },
    enabled: options.enabled,
    staleTime: 1000 * 30,
  });
}

export function useInfiniteJobs(params: JobsQuery = {}, options: { enabled?: boolean } = {}) {
  return useInfiniteQuery<JobsResponse>({
    queryKey: ["jobs", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam as string;
      }
      const { data, error, response } = await apiClient.GET("/jobs", {
        params: { query: queryParams as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as JobsResponse;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor || undefined,
    enabled: options.enabled,
    staleTime: 1000 * 30,
  });
}

export function useRoleScopedJobs({
  role,
  userId,
}: {
  role?: UserRole;
  userId?: string;
}, options: { enabled?: boolean } = {}) {
  const params: JobsQuery =
    role === "CLIENT" && userId
      ? { clientId: userId, limit: 50 }
      : role === "ARTISAN" && userId
        ? { status: "OPEN", limit: 50 }
        : { limit: 50 };

  return useJobs(params, options);
}

export function useJob(jobId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<Job>({
    queryKey: ["jobs", "detail", jobId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/jobs/${jobId}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      // Backend returns { data: job }
      const result = await response.json();
      return (result?.data ?? result) as Job;
    },
    enabled: Boolean(jobId) && (options.enabled ?? true),
  });
}

export function useJobTimeline(id: string) {
  return useQuery<JobEvent[]>({
    queryKey: ["jobs", "timeline", id],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/jobs/${id}/timeline`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      // Backend returns { data: timeline[] }
      const result = await response.json();
      return (result?.data ?? result) as JobEvent[];
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation<Job, Error, any>({
    mutationFn: async (payload) => {
      const { data, error, response } = await apiClient.POST("/jobs" as any, {
        body: payload as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return (data as any)?.data as Job;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();

  return useMutation<Job, Error, { jobId: string; input: Partial<Job> }>({
    mutationFn: async ({ jobId, input }) => {
      const { data, error, response } = await apiClient.PATCH("/jobs/{id}" as any, {
        params: { path: { id: jobId } },
        body: input as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return (data as any)?.data as Job;
    },
    onSuccess: (data, variables) => {
      qc.setQueryData(["jobs", "detail", variables.jobId], data);
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  
  return useMutation<Job, Error, { id: string; status: JobStatus }>({
    mutationFn: async ({ id, status }) => {
      const { data, error, response } = await apiClient.PATCH("/jobs/{id}" as any, {
        params: { path: { id } },
        body: { status } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return (data as any)?.data as Job;
    },
    onSuccess: (data) => {
      qc.setQueryData(["jobs", "detail", data.id], data);
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs", "timeline", data.id] });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (jobId) => {
      const { data, error, response } = await apiClient.DELETE("/jobs/{id}" as any, {
        params: { path: { id: jobId } }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as { message: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
