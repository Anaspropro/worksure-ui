import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { WalletBalance, WalletSummary, WalletTransactionsResponse } from "@/types";

export type WalletCreateResponse = {
  wallet: WalletBalance;
  created: boolean;
  virtualAccount?: WalletBalance["virtualAccount"];
};

export const financeApi = {
  getBalance: async () => {
    const { data, error, response } = await apiClient.GET("/wallet/balance", {});
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data as unknown as WalletBalance;
  },
  getSummary: async () => {
    const { data, error, response } = await apiClient.GET("/wallet/summary", {});
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data as unknown as WalletSummary;
  },
  getTransactions: async (params: { limit?: number; offset?: number } = {}) => {
    const { data, error, response } = await apiClient.GET("/wallet/transactions", {
      params: { query: { limit: params.limit || 50, offset: params.offset || 0 } } as any
    });
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data as unknown as WalletTransactionsResponse;
  },
  createWallet: async () => {
    const { data, error, response } = await apiClient.POST("/wallet/create", {});
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data as unknown as WalletCreateResponse;
  },
  depositInit: async (input: { amount: number; callbackUrl?: string }) => {
    const { data, error, response } = await apiClient.POST("/wallet/deposit/init", {
      body: input as any
    });
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data as unknown as { authorizationUrl: string; reference: string };
  },
  depositVerify: async (input: { reference: string }) => {
    const { data, error, response } = await apiClient.POST("/wallet/deposit/verify", {
      body: input as any
    });
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data;
  },
  payoutRequest: async (input: { amount: number; bankCode: string; accountNumber: string }) => {
    const { data, error, response } = await apiClient.POST("/wallet/payout/request", {
      body: input as any
    });
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    return data;
  },
  getBanks: async () => {
    const { data, error, response } = await apiClient.GET("/payments/banks", {});
    if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
    
    const banks = data as unknown as { name: string; code: string; id: number }[];
    const uniqueBanks = new Map();
    for (const bank of banks) {
      if (!uniqueBanks.has(bank.code)) {
        uniqueBanks.set(bank.code, bank);
      }
    }
    return Array.from(uniqueBanks.values());
  },
};
