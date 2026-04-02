"use client";

import { useArtisanProfile, useSaveArtisanProfile } from "@/hooks/useProfile";

export function useKyc(enabled: boolean) {
  return useArtisanProfile(enabled);
}

export function useSaveKyc(hasExistingProfile: boolean) {
  return useSaveArtisanProfile(hasExistingProfile);
}
