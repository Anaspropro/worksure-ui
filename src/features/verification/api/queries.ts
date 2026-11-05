import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationApi } from './index';

export const verificationKeys = {
  all: ['verification'] as const,
  status: () => [...verificationKeys.all, 'status'] as const,
  banks: () => [...verificationKeys.all, 'banks'] as const,
};

export const useVerificationStatus = () => {
  return useQuery({
    queryKey: verificationKeys.status(),
    queryFn: verificationApi.getStatus,
  });
};

export const useSupportedBanks = () => {
  return useQuery({
    queryKey: verificationKeys.banks(),
    queryFn: verificationApi.getBanks,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSubmitMarketplaceVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verificationApi.submitMarketplace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};

export const useResolveBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verificationApi.resolveBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
      queryClient.invalidateQueries({ queryKey: ['kyc-status'] });
    },
  });
};

export const useInitiateFinancialVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verificationApi.initiateFinancial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};
