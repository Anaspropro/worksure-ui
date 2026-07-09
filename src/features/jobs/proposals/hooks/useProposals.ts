import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getJobProposals, getProposalById, submitProposal, updateProposalStatus, getProposalTimeline } from "../services/proposal-service";
import { SubmitProposalPayload } from "../schemas";
import { ProposalStatus } from "../types";

export function useJobProposals(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobs.proposals(jobId),
    queryFn: () => getJobProposals(jobId),
    enabled: !!jobId,
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ["proposals", "detail", id], // Custom key since it's not strictly job-nested here
    queryFn: () => getProposalById(id),
    enabled: !!id,
  });
}

export function useProposalTimeline(id: string) {
  return useQuery({
    queryKey: ["proposals", "timeline", id],
    queryFn: () => getProposalTimeline(id),
    enabled: !!id,
  });
}

export function useSubmitProposal(jobId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: SubmitProposalPayload) => submitProposal(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.proposals(jobId) });
    },
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProposalStatus }) => updateProposalStatus(id, status),
    onSuccess: (data) => {
      queryClient.setQueryData(["proposals", "detail", data.id], data);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.proposals(data.jobId) });
      queryClient.invalidateQueries({ queryKey: ["proposals", "timeline", data.id] });
    },
  });
}
