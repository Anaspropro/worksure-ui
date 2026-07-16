import { apiClient } from '@/shared/api/client';
import type { components } from '@/shared/api/generated/schema';

export type VerificationStatusResponseDto = components['schemas']['VerificationStatusResponseDto'];
export type MarketplaceVerificationSubmitDto = components['schemas']['MarketplaceVerificationSubmitDto'];
export type FinancialVerificationInitiateResponseDto = components['schemas']['FinancialVerificationInitiateResponseDto'];

export const verificationApi = {
  getStatus: async () => {
    const { data, error } = await apiClient.GET('/verification/status');
    if (error) throw error;
    return data;
  },
  submitMarketplace: async () => {
    const { data, error } = await apiClient.POST('/verification/marketplace/submit');
    if (error) throw error;
    return data;
  },
  initiateFinancial: async () => {
    const { data, error } = await apiClient.POST('/verification/financial/initiate');
    if (error) throw error;
    return data;
  }
};
