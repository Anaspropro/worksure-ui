"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
import type { WalletBalance, WalletSummary, WalletTransactionsResponse } from "@/types";

type WalletMutationInput = {
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
};

export function useWalletBalance() {
  return useQuery<WalletBalance>({
    queryKey: ["wallet", "balance"],
    queryFn: () => proxyFetch<WalletBalance>("/wallet/balance"),
  });
}

export function useWalletSummary() {
  return useQuery<WalletSummary>({
    queryKey: ["wallet", "summary"],
    queryFn: () => proxyFetch<WalletSummary>("/wallet/summary"),
  });
}

export function useWalletTransactions() {
  return useQuery<WalletTransactionsResponse>({
    queryKey: ["wallet", "transactions"],
    queryFn: () => proxyFetch<WalletTransactionsResponse>("/wallet/transactions"),
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => proxyFetch("/wallet/create", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useAddFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: WalletMutationInput) =>
      proxyFetch("/wallet/add-funds", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: WalletMutationInput) =>
      proxyFetch("/wallet/withdraw-funds", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

type PaystackInitInput = {
  amount: number;
  email: string;
  callbackUrl?: string;
};

type PaystackInitResponse = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

type PaystackVerifyInput = {
  reference: string;
};

export function usePaystackInit() {
  return useMutation<PaystackInitResponse, Error, PaystackInitInput>({
    mutationFn: (input) =>
      proxyFetch("/payments/paystack/init", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}

export function usePaystackVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PaystackVerifyInput) =>
      proxyFetch("/payments/paystack/verify", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
