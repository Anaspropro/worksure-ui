"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/api-client";
import type { WalletBalance, WalletSummary, WalletTransactionsResponse } from "@/types";

type WalletMutationInput = {
  amount: number;
  reference?: string;
  metadata?: Record<string, unknown>;
};

type WalletCreateResponse = {
  wallet: WalletBalance;
  created: boolean;
  virtualAccount?: WalletBalance["virtualAccount"];
};

export function useWalletBalance(options: { enabled?: boolean } = {}) {
  return useQuery<WalletBalance>({
    queryKey: ["wallet", "balance"],
    queryFn: () => proxyFetch<WalletBalance>("/wallet/balance"),
    enabled: options.enabled,
  });
}

export function useWalletSummary(options: { enabled?: boolean } = {}) {
  return useQuery<WalletSummary>({
    queryKey: ["wallet", "summary"],
    queryFn: () => proxyFetch<WalletSummary>("/wallet/summary"),
    enabled: options.enabled,
  });
}

export function useWalletTransactions(options: { enabled?: boolean } = {}) {
  return useQuery<WalletTransactionsResponse>({
    queryKey: ["wallet", "transactions"],
    queryFn: () => proxyFetch<WalletTransactionsResponse>("/wallet/transactions"),
    enabled: options.enabled,
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation<WalletCreateResponse, Error, void>({
    mutationFn: () => proxyFetch("/wallet/create", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useWalletDepositInit() {
  return useMutation({
    mutationFn: (input: { amount: number }) =>
      proxyFetch<{ authorizationUrl: string; reference: string }>("/wallet/deposit/init", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}

export function useWalletDepositVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { reference: string }) =>
      proxyFetch("/wallet/deposit/verify", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useWalletPayoutRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { amount: number; bankCode: string; accountNumber: string }) =>
      proxyFetch("/wallet/payout/request", {
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
      queryClient.refetchQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useBanks(options: { enabled?: boolean } = {}) {
  return useQuery<{ name: string; code: string; id: number }[]>({
    queryKey: ["banks"],
    queryFn: async () => {
      const banks = await proxyFetch<{ name: string; code: string; id: number }[]>("/payments/banks");
      const uniqueBanks = new Map();
      for (const bank of banks) {
        if (!uniqueBanks.has(bank.code)) {
          uniqueBanks.set(bank.code, bank);
        }
      }
      return Array.from(uniqueBanks.values());
    },
    enabled: options.enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
