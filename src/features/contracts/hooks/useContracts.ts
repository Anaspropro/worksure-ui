"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import * as contractService from "../services/contract-service";
import type { Contract } from "@/types";

export function useContracts(
  params: contractService.ContractsFilter = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery<contractService.ContractsResponse>({
    queryKey: queryKeys.contracts.list(params),
    queryFn: () => contractService.getContracts(params),
    enabled: options.enabled,
  });
}

export function useContract(
  contractId?: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery<Contract>({
    queryKey: contractId ? queryKeys.contracts.detail(contractId) : [],
    queryFn: () => contractService.getContractById(contractId!),
    enabled: Boolean(contractId) && (options.enabled ?? true),
  });
}

export function useContractTimeline(
  contractId?: string,
  options: { enabled?: boolean } = {}
) {
  const contractQuery = useContract(contractId, { enabled: options.enabled });
  
  return useQuery<contractService.ContractTimelineEvent[]>({
    queryKey: contractId ? queryKeys.contracts.timeline(contractId) : [],
    queryFn: () => {
      if (!contractQuery.data) return [];
      return contractService.deriveTimelineFromContract(contractQuery.data);
    },
    enabled: Boolean(contractId) && (options.enabled ?? true) && !!contractQuery.data,
  });
}

export function useContractActivity(
  contractId?: string,
  options: { enabled?: boolean } = {}
) {
  const timelineQuery = useContractTimeline(contractId, { enabled: options.enabled });
  
  return useQuery<contractService.ContractTimelineEvent[]>({
    queryKey: contractId ? queryKeys.contracts.activity(contractId) : [],
    queryFn: () => {
      return timelineQuery.data ?? [];
    },
    enabled: Boolean(contractId) && (options.enabled ?? true) && !!timelineQuery.data,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, string>({
    mutationFn: (proposalId) => contractService.createContract(proposalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.lists() });
      qc.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useFundContract() {
  const qc = useQueryClient();
  return useMutation<
    contractService.FundContractResult,
    Error,
    contractService.FundContractInput
  >({
    mutationFn: (input) => contractService.fundContract(input),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.escrow(variables.contractId) });
    },
  });
}

export function useVerifyContractPayment() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, { reference: string; contractId?: string }>({
    mutationFn: ({ reference }) => contractService.verifyPayment(reference),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.all });
      if (variables.contractId) {
        qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.contractId) });
        qc.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
        qc.invalidateQueries({ queryKey: queryKeys.contracts.escrow(variables.contractId) });
      }
    },
  });
}

export function useConfirmCompletion() {
  const qc = useQueryClient();
  return useMutation<Contract, Error, contractService.ConfirmCompletionInput>({
    mutationFn: (input) => contractService.confirmCompletion(input),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
    },
  });
}

export function useReleaseEscrow() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (contractId) => contractService.releaseEscrow(contractId),
    onSuccess: (data, contractId) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.escrow(contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.timeline(contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.financial.all });
    },
  });
}

export function useRefundContract() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, contractService.RefundInput>({
    mutationFn: (input) => contractService.refundContract(input),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.contracts.detail(variables.contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.escrow(variables.contractId) });
      qc.invalidateQueries({ queryKey: queryKeys.contracts.timeline(variables.contractId) });
    },
  });
}
