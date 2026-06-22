"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/api-client";
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

function buildProposalQuery({
  role,
  userId,
  ...params
}: ProposalsQuery = {}) {
  const query = new URLSearchParams();

  if (role === "ARTISAN" && userId) {
    query.set("artisanId", userId);
  }

  if (role === "CLIENT" && userId) {
    query.set("clientId", userId);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  if (!query.has("limit")) {
    query.set("limit", "50");
  }

  return query.toString();
}

export function useProposals(params: ProposalsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<ProposalsResponse>({
    queryKey: ["proposals", params],
    queryFn: () =>
      proxyFetchRaw<ProposalsResponse>(`/proposals?${buildProposalQuery(params)}`),
    enabled: options.enabled,
  });
}

export function useProposal(proposalId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<Proposal>({
    queryKey: ["proposals", "detail", proposalId],
    queryFn: () => proxyFetch<Proposal>(`/proposals/${proposalId}`),
    enabled: Boolean(proposalId) && (options.enabled ?? true),
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, { jobId: string; amount: number; message: string }>({
    mutationFn: (data) =>
      proxyFetch<Proposal>("/proposals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useAcceptProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, string>({
    mutationFn: (proposalId) =>
      proxyFetch<Proposal>(`/proposals/${proposalId}/accept`, { method: "PATCH" }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useRejectProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, string>({
    mutationFn: (proposalId) =>
      proxyFetch<Proposal>(`/proposals/${proposalId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({}),
      }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useWithdrawProposal() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (proposalId) =>
      proxyFetch<{ message: string }>(`/proposals/${proposalId}/withdraw`, {
        method: "PATCH",
      }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
