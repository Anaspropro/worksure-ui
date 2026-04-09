"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
import type { Contract, ContractStatus } from "@/types";

export function useContracts(status?: ContractStatus | string, options: { enabled?: boolean } = {}) {
  return useQuery<Contract[]>({
    queryKey: ["contracts", status],
    queryFn: () => proxyFetch<Contract[]>(`/contracts${status ? `?status=${status}` : ""}`),
    enabled: options.enabled,
  });
}

export function useContract(contractId?: string, options: { enabled?: boolean } = {}) {
  return useQuery<Contract>({
    queryKey: ["contracts", "detail", contractId],
    queryFn: () => proxyFetch<Contract>(`/contracts/${contractId}`),
    enabled: Boolean(contractId) && (options.enabled ?? true),
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, string>({
    mutationFn: (proposalId) =>
      proxyFetch<Contract>("/contracts", {
        method: "POST",
        body: JSON.stringify({ proposalId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useFundContract() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, { contractId: string; amount: number }>({
    mutationFn: ({ contractId, amount }) =>
      proxyFetch<Contract>(`/contracts/${contractId}/fund`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useConfirmCompletion() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, { contractId: string; isClient: boolean }>({
    mutationFn: ({ contractId, isClient }) =>
      proxyFetch<Contract>(`/contracts/${contractId}/confirm-completion`, {
        method: "POST",
        body: JSON.stringify({ isClient }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useReleaseEscrow() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (contractId) =>
      proxyFetch<{ message: string }>(`/contracts/${contractId}/release-escrow`, {
        method: "POST",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useRefundContract() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { contractId: string; reason: string }>({
    mutationFn: ({ contractId, reason }) =>
      proxyFetch<{ message: string }>(`/contracts/${contractId}/refund`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}
