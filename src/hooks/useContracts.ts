"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch, proxyFetchRaw } from "@/api-client";
import type { ApiPagination, Contract, ContractStatus } from "@/types";

export type ContractsQuery = {
  status?: ContractStatus | string;
  page?: number;
  limit?: number;
};

export type ContractsResponse = {
  data: Contract[];
  pagination: ApiPagination;
};

function buildContractsQuery(params: ContractsQuery = {}) {
  const query = new URLSearchParams();
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

export function useContracts(params: ContractsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<ContractsResponse>({
    queryKey: ["contracts", params],
    queryFn: () => proxyFetchRaw<ContractsResponse>(`/contracts?${buildContractsQuery(params)}`),
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
  return useMutation<{ payment: any, authorizationUrl: string, reference: string }, Error, { contractId: string; email: string; callbackUrl?: string }>({
    mutationFn: ({ contractId, email, callbackUrl }) =>
      proxyFetch<{ payment: any, authorizationUrl: string, reference: string }>(`/contracts/${contractId}/fund`, {
        method: "POST",
        body: JSON.stringify({ contractId, email, callbackUrl }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useVerifyContractPayment() {
  const qc = useQueryClient();
  return useMutation<any, Error, { reference: string }>({
    mutationFn: ({ reference }) =>
      proxyFetch<any>("/payments/paystack/verify", {
        method: "POST",
        body: JSON.stringify({ reference }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}

export function useConfirmCompletion() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, { contractId: string; isClient: boolean; notes?: string }>({
    mutationFn: ({ contractId, isClient, notes }) =>
      proxyFetch<Contract>(`/contracts/${contractId}/confirm-completion`, {
        method: "POST",
        body: JSON.stringify({ contractId, isClient, notes }),
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
        body: JSON.stringify({ contractId, reason }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contracts"] }),
  });
}
