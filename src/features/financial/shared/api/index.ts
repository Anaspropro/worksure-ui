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
    const response = await fetch("/api/proxy/wallet/balance", { cache: "no-store" });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json() as WalletBalance;
  },
  getSummary: async () => {
    const response = await fetch("/api/proxy/wallet/summary", { cache: "no-store" });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json() as WalletSummary;
  },
  getTransactions: async (params: { limit?: number; offset?: number } = {}) => {
    const response = await fetch(`/api/proxy/wallet/transactions?limit=${params.limit || 50}&offset=${params.offset || 0}`, { cache: "no-store" });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json() as WalletTransactionsResponse;
  },
  createWallet: async () => {
    const response = await fetch("/api/proxy/wallet/create", { method: "POST", cache: "no-store" });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json() as WalletCreateResponse;
  },
  depositInit: async (input: { amount: number; callbackUrl?: string }) => {
    const response = await fetch("/api/proxy/wallet/deposit/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store"
    });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json() as { authorizationUrl: string; reference: string };
  },
  depositVerify: async (input: { reference: string }) => {
    const response = await fetch("/api/proxy/wallet/deposit/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store"
    });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json();
  },
  payoutRequest: async (input: { amount: number; bankCode: string; accountNumber: string }) => {
    const response = await fetch("/api/proxy/wallet/payout/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store"
    });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    return await response.json();
  },
  getBanks: async () => {
    const response = await fetch("/api/proxy/payments/banks", { cache: "no-store" });
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch (e) {}
      throw new ApiError(response.statusText, response.status, errorData);
    }
    const banks = await response.json() as { name: string; code: string; id: number }[];
    const uniqueBanks = new Map();
    for (const bank of banks) {
      if (!uniqueBanks.has(bank.code)) {
        uniqueBanks.set(bank.code, bank);
      }
    }
    return Array.from(uniqueBanks.values());
  },
};
