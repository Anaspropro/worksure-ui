import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { CreateReviewInput } from "../schemas";
import { Review } from "../types";
import { reviewKeys, reputationKeys } from "@/shared/api/queryKeys";
import { toast } from "sonner";
import { components } from "@/shared/api/generated/schema";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewInput & { targetId: string }): Promise<Review> => {
      // Create body mapped to the backend endpoint expectations
      const payload = {
        targetId: data.targetId,
        rating: data.rating,
        comment: data.comment,
        breakdown: {
          workQuality: data.workQuality,
          communication: data.communication,
          timeliness: data.timeliness,
          professionalism: data.professionalism,
        }
      };

      const { data: responseData, error, response } = await apiClient.POST("/reviews/{contractId}/submit", {
        params: { path: { contractId: data.contractId } },
        body: payload as any, // bypassing strict schema for now if the type generator hasn't correctly exported the dynamic body
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return responseData as unknown as Review;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: reputationKeys.all });
      queryClient.invalidateQueries({ queryKey: ["contracts", variables.contractId] });
      toast.success("Review submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}
