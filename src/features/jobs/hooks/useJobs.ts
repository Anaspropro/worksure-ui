import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getJobs, getJobById, createJob, updateJobStatus, getJobTimeline } from "../services/job-service";
import { CreateJobPayload } from "../schemas";
import { JobStatus } from "../types";

export function useJobs(filter?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.jobs.list(filter || {}),
    queryFn: () => getJobs(filter),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}

export function useJobTimeline(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.timeline(id),
    queryFn: () => getJobTimeline(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateJobPayload) => createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) => updateJobStatus(id, status),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.jobs.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.timeline(data.id) });
    },
  });
}
