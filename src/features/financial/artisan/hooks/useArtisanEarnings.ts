"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../../shared/api";
import { financialQueryKeys } from "../../shared/utils/queryKeys";

export function useArtisanEarnings(options: { enabled?: boolean } = {}) {
  const balanceQuery = useQuery({
    queryKey: financialQueryKeys.artisanEarnings(),
    queryFn: financeApi.getBalance,
    enabled: options.enabled,
  });

  const summaryQuery = useQuery({
    queryKey: financialQueryKeys.artisanPayouts(),
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

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.payoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.artisan() });
      queryClient.invalidateQueries({ queryKey: financialQueryKeys.transactions() });
    },
  });
}

export function useBanks(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["banks"],
    queryFn: financeApi.getBanks,
    enabled: options.enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
