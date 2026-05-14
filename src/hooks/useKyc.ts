"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";

import { useArtisanProfile, useSaveArtisanProfile } from "./useProfile";

export function useVerifyBvn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bvn: string) => {
      return proxyFetch("/kyc/verify-bvn", {
        method: "POST",
        body: JSON.stringify({ bvn }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-status"] });
    },
  });
}

export function useKycStatus() {
  return useQuery({
    queryKey: ["kyc-status"],
    queryFn: async () => {
      return proxyFetch<{ kycStatus: string; kycVerified: boolean }>("/kyc/status");
    },
  });
}

export const useKyc = useArtisanProfile;
export const useSaveKyc = useSaveArtisanProfile;
