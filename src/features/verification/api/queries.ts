import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationApi } from './index';

export const verificationKeys = {
  all: ['verification'] as const,
  status: () => [...verificationKeys.all, 'status'] as const,
};

export const useVerificationStatus = () => {
  return useQuery({
    queryKey: verificationKeys.status(),
    queryFn: verificationApi.getStatus,
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

export const useInitiateFinancialVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verificationApi.initiateFinancial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};
