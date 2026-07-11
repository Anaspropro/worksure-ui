import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { components } from '@/shared/api/generated/schema';
import { operations } from '@/shared/api/generated/schema';

type ProposalListQueryDto = operations['ProposalsController_listProposals']['parameters']['query'];
type CreateProposalDto = components['schemas']['CreateProposalDto'];

export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: ProposalListQueryDto) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  compares: () => [...proposalKeys.all, 'compare'] as const,
  compare: (jobId: string) => [...proposalKeys.compares(), jobId] as const,
};

export function useProposals(filters: ProposalListQueryDto = {}) {
  return useQuery({
    queryKey: proposalKeys.list(filters),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/proposals', {
        params: {
          query: filters,
        },
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/proposals/{id}', {
        params: {
          path: { id },
        },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposal: CreateProposalDto) => {
      const { data, error } = await apiClient.POST('/proposals', {
        body: proposal,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

export function useProposalAction(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, notes }: { action: 'ACCEPT' | 'REJECT' | 'WITHDRAW', notes?: string }) => {
      let endpoint: any = '';
      if (action === 'ACCEPT') endpoint = '/proposals/{id}/accept';
      else if (action === 'REJECT') endpoint = '/proposals/{id}/reject';
      else if (action === 'WITHDRAW') endpoint = '/proposals/{id}/withdraw';

      const { data, error } = await apiClient.PATCH(endpoint, {
        params: {
          path: { id },
        },
        body: notes ? { notes } : undefined,
      } as any);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

export function useProposalCompare(jobId: string) {
  return useQuery({
    queryKey: proposalKeys.compare(jobId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/proposals/job/{jobId}/compare', {
        params: {
          path: { jobId },
        },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });
}
