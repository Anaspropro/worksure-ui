import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { CreateReviewInput } from "../schemas";
import { Review } from "../types";
import { reviewKeys } from "@/shared/api/queryKeys";
import { toast } from "sonner";
import { components } from "@/shared/api/generated/schema";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewInput): Promise<Review> => {
      const { data: responseData, error, response } = await apiClient.POST("/reviews", {
        body: data as components["schemas"]["CreateReviewDto"],
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return responseData as unknown as Review;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
      // Also invalidate contract data since it might reflect the review state
      queryClient.invalidateQueries({
        queryKey: ["contracts", variables.contractId],
      });
      toast.success("Review submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}
