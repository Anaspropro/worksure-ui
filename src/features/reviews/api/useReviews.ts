"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import type { ApiPagination, Review, ReviewStats } from "@/types";

export { useCreateReview } from "./create-review";

export type ReviewsQuery = {
  contractId?: string;
  clientId?: string;
  artisanId?: string;
  page?: number;
  limit?: number;
};

type ReviewsResponse = {
  reviews: Review[];
  pagination: ApiPagination;
};

export function useReviews(params: ReviewsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<Review[]>({
    queryKey: ["reviews", params],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/reviews", {
        params: { query: params as any }
      });
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      const resData = data as unknown as ReviewsResponse;
      return resData.reviews || (data as unknown as Review[]);
    },
    enabled: options.enabled,
  });
}

export function useMyReviews(options: { enabled?: boolean } = {}) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "me"],
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/reviews/me");
      if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
      return data as unknown as Review[];
    },
    enabled: options.enabled,
  });
}

export function useReviewStats(artisanId?: string) {
  return useQuery<ReviewStats>({
    queryKey: ["reviews", "stats", artisanId],
    queryFn: async () => {
      const response = await fetch(`/api/proxy/reviews/stats/${artisanId}`, { cache: "no-store" });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) {}
        throw new ApiError(response.statusText, response.status, errorData);
      }
      return await response.json();
    },
    enabled: Boolean(artisanId),
  });
}
