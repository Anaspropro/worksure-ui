"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/api-client";

import { useArtisanProfile, useSaveArtisanProfile } from "./useProfile";
import { useUpload } from "./useUpload";

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
  const { uploadFile } = useUpload();
  
  return useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      const cloudinaryUpload = await uploadFile(file);
      if (!cloudinaryUpload) {
        throw new Error("Failed to upload KYC document");
      }

      return proxyFetch("/kyc/upload", {
        method: "POST",
        body: JSON.stringify({
          documentType,
          documentUrl: cloudinaryUpload.secure_url,
        }),
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
