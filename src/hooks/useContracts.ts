"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
import type { Contract } from "@/types";

export function useContracts() {
  return useQuery<Contract[], Error, Contract[]>(
    ["contracts"],
    () => proxyFetch<{ data: Contract[] }>("/contracts").then((x) => x.data),
  );
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, string>(
    (proposalId) =>
      proxyFetch<Contract>("/contracts", {
        method: "POST",
        body: JSON.stringify({ proposalId }),
      }),
    { onSuccess: () => qc.invalidateQueries(["contracts"]) },
  );
}

export function useFundContract() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, { contractId: string; amount: number }>(
    ({ contractId, amount }) =>
      proxyFetch<Contract>(`/contracts/${contractId}/fund`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    { onSuccess: () => qc.invalidateQueries(["contracts"]) },
  );
}

export function useConfirmCompletion() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, { contractId: string; isClient: boolean }>(
    ({ contractId, isClient }) =>
      proxyFetch<Contract>(`/contracts/${contractId}/confirm-completion`, {
        method: "POST",
        body: JSON.stringify({ isClient }),
      }),
    { onSuccess: () => qc.invalidateQueries(["contracts"]) },
  );
}

export function useReleaseEscrow() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>(
    (contractId) =>
      proxyFetch<{ message: string }>(`/contracts/${contractId}/release-escrow`, {
        method: "POST",
      }),
    { onSuccess: () => qc.invalidateQueries(["contracts"]) },
  );
}

export function useRefundContract() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { contractId: string; reason: string }>(
    ({ contractId, reason }) =>
      proxyFetch<{ message: string }>(`/contracts/${contractId}/refund`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    { onSuccess: () => qc.invalidateQueries(["contracts"]) },
  );
}
