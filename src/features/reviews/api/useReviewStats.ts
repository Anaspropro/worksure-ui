import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { reviewKeys } from "@/shared/api/queryKeys";

export function useReviewStats(artisanId?: string) {
  return useQuery({
    queryKey: artisanId ? reviewKeys.stats(artisanId) : reviewKeys.all,
    queryFn: async () => {
      // Stubbing this since I don't see a dedicated endpoint for it yet, or returning empty
      return { totalReviews: 0, averageRating: 0, ratingDistribution: {} };
    },
    enabled: Boolean(artisanId),
  });
}
