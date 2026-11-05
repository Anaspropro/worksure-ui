import { apiClient } from '@/shared/api/client';
import type { components } from '@/shared/api/generated/schema';

export type VerificationStatusResponseDto = components['schemas']['VerificationStatusResponseDto'] & {
  payoutAccountName?: string;
  payoutAccountNumber?: string;
  payoutBankCode?: string;
  artisanVerified?: boolean;
  documents?: any[];
};
export type MarketplaceVerificationSubmitDto = any;
export type FinancialVerificationInitiateResponseDto = components['schemas']['FinancialVerificationInitiateResponseDto'];

export interface BankOption {
  name: string;
  code: string;
  slug: string;
}

export const verificationApi = {
  getStatus: async () => {
    const { data, error } = await apiClient.GET('/verification/status');
    if (error) throw error;
    return data as any;
  },
  getBanks: async (): Promise<BankOption[]> => {
    const { data, error } = await (apiClient as any).GET('/verification/banks');
    if (error) throw error;
    return (data as BankOption[]) || [];
  },
  resolveBankAccount: async (params: { accountNumber: string; bankCode: string }) => {
    const { data, error } = await (apiClient as any).POST('/verification/financial/bank-account', {
      body: params,
    });
    if (error) throw error;
    return data;
  },
  submitMarketplace: async () => {
    const { data, error } = await apiClient.POST('/verification/marketplace/submit');
    if (error) throw error;
    return data;
  },
  initiateFinancial: async (body?: { accountNumber?: string; bankCode?: string }) => {
    const { data, error } = await (apiClient as any).POST('/verification/financial/initiate', {
      body,
    });
    if (error) throw error;
    return data;
  },
};
