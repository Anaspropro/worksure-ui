import { proxyFetch } from "@/api-client";
import type { WalletBalance, WalletSummary, WalletTransactionsResponse } from "@/types";

export type WalletCreateResponse = {
  wallet: WalletBalance;
  created: boolean;
  virtualAccount?: WalletBalance["virtualAccount"];
};

export const financeApi = {
  getBalance: () => proxyFetch<WalletBalance>("/wallet/balance"),
  getSummary: () => proxyFetch<WalletSummary>("/wallet/summary"),
  getTransactions: () => proxyFetch<WalletTransactionsResponse>("/wallet/transactions"),
  createWallet: () => proxyFetch<WalletCreateResponse>("/wallet/create", { method: "POST" }),
  
  depositInit: (input: { amount: number; callbackUrl?: string }) =>
    proxyFetch<{ authorizationUrl: string; reference: string }>("/wallet/deposit/init", {
      method: "POST",
      body: JSON.stringify(input),
    }),
    
  depositVerify: (input: { reference: string }) =>
    proxyFetch("/wallet/deposit/verify", {
      method: "POST",
      body: JSON.stringify(input),
    }),
    
  payoutRequest: (input: { amount: number; bankCode: string; accountNumber: string }) =>
    proxyFetch("/wallet/payout/request", {
      method: "POST",
      body: JSON.stringify(input),
    }),
    
  getBanks: async () => {
    const banks = await proxyFetch<{ name: string; code: string; id: number }[]>("/payments/banks");
    const uniqueBanks = new Map();
    for (const bank of banks) {
      if (!uniqueBanks.has(bank.code)) {
        uniqueBanks.set(bank.code, bank);
      }
    }
    return Array.from(uniqueBanks.values());
  },
};
