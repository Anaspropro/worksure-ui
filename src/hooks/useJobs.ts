"use client";

import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/api-client";
import type { ApiPagination, Job, JobStatus, UserRole } from "@/types";

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
  jobs: Job[];
  pagination: ApiPagination;
};

function buildJobsQuery(params: JobsQuery = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  return search.toString();
}

export function useJobs(params: JobsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", params],
    queryFn: () =>
      proxyFetchRaw<JobsResponse>(`/jobs${buildJobsQuery(params) ? `?${buildJobsQuery(params)}` : ""}`),
    enabled: options.enabled,
    staleTime: 1000 * 30,
  });
}

export function useInfiniteJobs(params: JobsQuery = {}, options: { enabled?: boolean } = {}) {
  return useInfiniteQuery<JobsResponse>({
    queryKey: ["jobs", "infinite", params],
    queryFn: ({ pageParam }) => {
      const queryParams = { ...params };
      if (pageParam) {
        queryParams.cursor = pageParam as string;
      }
      return proxyFetchRaw<JobsResponse>(
        `/jobs${buildJobsQuery(queryParams) ? `?${buildJobsQuery(queryParams)}` : ""}`
      );
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
    queryFn: () => proxyFetch<Job>(`/jobs/${jobId}`),
    enabled: Boolean(jobId) && (options.enabled ?? true),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation<Job, Error, { title: string; description: string; budget: number; category: string }>(
    {
      mutationFn: (data) =>
        proxyFetch<Job>("/jobs", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      onSuccess() {
        qc.invalidateQueries({ queryKey: ["jobs"] });
      },
    },
  );
}

export function useUpdateJob() {
  const qc = useQueryClient();

  return useMutation<Job, Error, { jobId: string; input: Partial<Job> }>({
    mutationFn: ({ jobId, input }) =>
      proxyFetch<Job>(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (jobId) =>
      proxyFetch(`/jobs/${jobId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
