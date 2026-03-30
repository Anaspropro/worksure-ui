"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
import type { Proposal } from "@/types";

export function useProposals(userId?: string) {
  return useQuery<Proposal[], Error, Proposal[]>(
    ["proposals", userId],
    () => proxyFetch<{ proposals: Proposal[] }>(`/proposals?artisanId=${userId || ""}&limit=50`).then((x) => x.proposals),
  );
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, { jobId: string; amount: number; message: string }>(
    (data) =>
      proxyFetch<Proposal>("/proposals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    {
      onSuccess() {
        qc.invalidateQueries(["proposals"]);
      },
    },
  );
}

export function useAcceptProposal() {
  const qc = useQueryClient();
  return useMutation<Proposal, Error, string>(
    (proposalId) => proxyFetch<Proposal>(`/proposals/${proposalId}/accept`, { method: "PATCH" }),
    {
      onSuccess() {
        qc.invalidateQueries(["proposals"]);
      },
    },
  );
}
