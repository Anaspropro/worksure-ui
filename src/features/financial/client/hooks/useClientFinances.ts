"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../shared/api";
import { financialQueryKeys } from "../../shared/utils/queryKeys";

export function useClientFinances(options: { enabled?: boolean } = {}) {
  const balanceQuery = useQuery({
    queryKey: financialQueryKeys.clientBalance(),
    queryFn: financeApi.getBalance,
    enabled: options.enabled,
  });

  const summaryQuery = useQuery({
    queryKey: financialQueryKeys.clientEscrow(),
    queryFn: financeApi.getSummary,
    enabled: options.enabled,
  });

  const transactionsQuery = useQuery({
    queryKey: financialQueryKeys.transactions(),
    queryFn: () => financeApi.getTransactions(),
    enabled: options.enabled,
  });

  return {
    balance: balanceQuery.data,
    summary: summaryQuery.data,
    transactions: transactionsQuery.data?.transactions ?? [],
    isLoading: balanceQuery.isLoading || summaryQuery.isLoading || transactionsQuery.isLoading,
    isError: balanceQuery.isError || summaryQuery.isError || transactionsQuery.isError,
    refetch: () => {
      balanceQuery.refetch();
      summaryQuery.refetch();
      transactionsQuery.refetch();
    },
  };
}

export function useFundAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.depositInit,
    onSuccess: () => {
      // Invalidate balance on return from gateway
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.client() });
    },
  });
}

export function useVerifyDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.depositVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.client() });
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.transactions() });
    },
  });
}
