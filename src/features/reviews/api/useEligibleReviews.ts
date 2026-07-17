import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { reviewKeys } from "@/shared/api/queryKeys";

export function useEligibleReviews(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: reviewKeys.eligible(),
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/reviews/eligible");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return (data as unknown) as any[];
    },
    enabled: options.enabled,
  });
}
