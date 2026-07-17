import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { adminKeys } from "@/shared/api/queryKeys";

interface GetAllReviewsFilter {
  status?: string;
  search?: string;
  cursor?: string;
  limit?: string;
}

export function useAdminReviews(filter: GetAllReviewsFilter) {
  return useQuery({
    queryKey: adminKeys.reviews(filter),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/admin/reviews", {
        params: { query: filter as any },
      });
      if (error) throw error;
      return data as any;
    },
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, action, reason }: { reviewId: string; action: "FLAG" | "LOCK" | "RESTORE"; reason?: string }) => {
      const { data, error } = await apiClient.PATCH("/admin/reviews/{id}/moderate", {
        params: { path: { id: reviewId } },
        body: { action, reason } as any,
      });
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      // Invalidate the admin reviews lists so the updated status shows
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}
