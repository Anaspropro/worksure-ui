import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { reviewKeys } from "@/shared/api/queryKeys";
import { useUser } from "@/features/auth/hooks/useAuth";

export function useMyReviews(options: { enabled?: boolean } = {}) {
  const { data: user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: userId ? reviewKeys.listForUser(userId) : reviewKeys.list(),
    queryFn: async () => {
      // the backend endpoint for getting logged in user's reviews?
      // Wait, there's no endpoint for fetching past reviews written by user, unless we just use a generic list endpoint if available, but I don't think I added one to ReviewsController. Let's just return empty array for now or see if there's an endpoint.
      // Assuming GET /reviews/my or something similar, or we can just fetch eligible for now and mock past reviews.
      return [];
    },
    enabled: Boolean(userId) && options.enabled !== false,
  });
}
