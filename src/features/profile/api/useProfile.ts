"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { User } from "@/types";

export type ArtisanProfile = {
  id: string;
  userId: string;
  bio?: string | null;
  skills?: string[] | string | null;
  experience?: string | null;
  portfolio?: string[] | string | null;
  verified: boolean;
  rating?: number | null;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email">;
};

type ProfileUpdateInput = Partial<{
  name: string;
  email: string;
  phone: string;
  address: string;
  artisanVerified: boolean;
}>;

type ArtisanProfileInput = Partial<{
  bio: string;
  skills: string[];
  experience: string;
  portfolio: string[];
}>;

export function useProfile(options: { enabled?: boolean } = {}) {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/users/me");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as User;
    },
    enabled: options.enabled,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProfileUpdateInput) => {
      const { data, error, response } = await apiClient.PATCH("/users/me", {
        body: input as any
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useArtisanProfile(enabled: boolean) {
  return useQuery<ArtisanProfile>({
    queryKey: ["artisan-profile", "me"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/artisan/profile/me");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as ArtisanProfile;
    },
    enabled,
    retry: false,
  });
}

export function useSaveArtisanProfile(hasExistingProfile: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ArtisanProfileInput) => {
      if (hasExistingProfile) {
        const { data, error, response } = await apiClient.PATCH("/artisan/profile", {
          body: input as any
        });
        if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
        return data as unknown as ArtisanProfile;
      } else {
        const { data, error, response } = await apiClient.POST("/artisan/profile", {
          body: input as any
        });
        if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
        return data as unknown as ArtisanProfile;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artisan-profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
