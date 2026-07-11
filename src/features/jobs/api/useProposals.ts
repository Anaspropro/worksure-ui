"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { ApiPagination, Proposal, ProposalStatus, UserRole } from "@/types";

export type ProposalsQuery = {
  role?: UserRole;
  userId?: string;
  status?: ProposalStatus | string;
  jobId?: string;
  clientId?: string;
  artisanId?: string;
  page?: number;
  limit?: number;
};

type ProposalsResponse = {
  proposals: Proposal[];
  pagination: ApiPagination;
};

export function useProposals(params: ProposalsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<ProposalsResponse>({
    queryKey: ["proposals", params],
    queryFn: async () => {
      const queryParams: Record<string, any> = { ...params };
      if (params.role === "ARTISAN" && params.userId) {
        queryParams.artisanId = params.userId;
      }
      if (params.role === "CLIENT" && params.userId) {
        queryParams.clientId = params.userId;
      }
      if (!queryParams.limit) {
        queryParams.limit = 50;
      }
      delete queryParams.role;
      delete queryParams.userId;

      const { data, error, response } = await apiClient.GET("/proposals", {
        params: { query: queryParams as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as ProposalsResponse;
    },
    enabled: options.enabled,
  });
}

export function useProposal(proposalId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<Proposal>({
    queryKey: ["proposals", "detail", proposalId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/proposals/${proposalId}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      return await response.json();
    },
    enabled: Boolean(proposalId) && (options.enabled ?? true),
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, { jobId: string; amount: number; message: string }>({
    mutationFn: async (payload) => {
      const { data, error, response } = await apiClient.POST("/proposals", {
        body: payload as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as Proposal;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useAcceptProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, string>({
    mutationFn: async (proposalId) => {
      const { data, error, response } = await apiClient.PATCH("/proposals/{id}/accept" as any, {
        params: { path: { id: proposalId } }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as Proposal;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useRejectProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, string>({
    mutationFn: async (proposalId) => {
      const { data, error, response } = await apiClient.PATCH("/proposals/{id}/reject" as any, {
        params: { path: { id: proposalId } },
        body: {} as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as Proposal;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useWithdrawProposal() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (proposalId) => {
      const { data, error, response } = await apiClient.PATCH("/proposals/{id}/withdraw" as any, {
        params: { path: { id: proposalId } }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as { message: string };
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
