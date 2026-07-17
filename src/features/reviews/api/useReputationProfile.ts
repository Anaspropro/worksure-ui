import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { reputationKeys } from "@/shared/api/queryKeys";

export function useReputationProfile(userId: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: reputationKeys.profile(userId),
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/reviews/reputation/{userId}", {
        params: { path: { userId } }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return (data as unknown) as any;
    },
    enabled: Boolean(userId) && options.enabled !== false,
  });
}
