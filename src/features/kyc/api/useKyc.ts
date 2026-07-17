"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";

import { useArtisanProfile, useSaveArtisanProfile } from "@/features/profile/api/useProfile";
import { useUpload } from "@/features/shared/api/useUpload";

export function useVerifyIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { bvn: string; bankCode: string; accountNumber: string }) => {
      const { error, response } = await apiClient.POST(("/kyc/verify-identity" as any), {
        body: data as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
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

      const { error, response } = await apiClient.POST(("/kyc/upload" as any), {
        body: {
          documentType,
          documentUrl: cloudinaryUpload.secure_url,
        } as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
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
      const { data, error, response } = await apiClient.GET(("/kyc/status" as any), {});
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as { 
        kycStatus: string; 
        kycVerified: boolean;
        documents?: { id: string; documentType: string; status: string; documentUrl: string }[];
      };
    },
  });
}

export const useKyc = useArtisanProfile;
export const useSaveKyc = useSaveArtisanProfile;
