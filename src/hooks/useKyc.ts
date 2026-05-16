"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/api-client";

import { useArtisanProfile, useSaveArtisanProfile } from "./useProfile";

export function useVerifyIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { bvn: string; bankCode: string; accountNumber: string }) => {
      return proxyFetch("/kyc/verify-identity", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-status"] });
    },
  });
}

export function useUploadKycDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      // proxyFetch uses fetch under the hood. For FormData, we don't set Content-Type header manually.
      return proxyFetch("/kyc/upload", {
        method: "POST",
        body: formData,
        // Assuming proxyFetch handles FormData correctly and doesn't stringify it
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc-status"] });
    },
  });
}

export function useKycStatus() {
  return useQuery({
    queryKey: ["kyc-status"],
    queryFn: async () => {
      return proxyFetch<{ 
        kycStatus: string; 
        kycVerified: boolean;
        documents?: { id: string; documentType: string; status: string; documentUrl: string }[];
      }>("/kyc/status");
    },
  });
}

export const useKyc = useArtisanProfile;
export const useSaveKyc = useSaveArtisanProfile;
