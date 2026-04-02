"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetch } from "@/proxy";
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

export function useProfile() {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: () => proxyFetch<User>("/users/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileUpdateInput) =>
      proxyFetch<User>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useArtisanProfile(enabled: boolean) {
  return useQuery<ArtisanProfile>({
    queryKey: ["artisan-profile", "me"],
    queryFn: () => proxyFetch<ArtisanProfile>("/artisan/profile/me"),
    enabled,
    retry: false,
  });
}

export function useSaveArtisanProfile(hasExistingProfile: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ArtisanProfileInput) =>
      proxyFetch<ArtisanProfile>(hasExistingProfile ? "/artisan/profile" : "/artisan/profile", {
        method: hasExistingProfile ? "PATCH" : "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artisan-profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
