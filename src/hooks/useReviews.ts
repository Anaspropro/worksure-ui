"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyFetchRaw } from "@/api-client";
import type { ApiPagination, Review, ReviewStats } from "@/types";

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

function buildReviewsQuery(params: ReviewsQuery = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

export function useReviews(params: ReviewsQuery = {}, options: { enabled?: boolean } = {}) {
  return useQuery<Review[]>({
    queryKey: ["reviews", params],
    queryFn: () =>
      proxyFetchRaw<ReviewsResponse>(`/reviews${buildReviewsQuery(params) ? `?${buildReviewsQuery(params)}` : ""}`).then(
        (response) => response.reviews,
      ),
    enabled: options.enabled,
  });
}

export function useMyReviews(options: { enabled?: boolean } = {}) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "me"],
    queryFn: () => proxyFetchRaw<Review[]>("/reviews/me"),
    enabled: options.enabled,
  });
}

export function useReviewStats(artisanId?: string) {
  return useQuery<ReviewStats>({
    queryKey: ["reviews", "stats", artisanId],
    queryFn: () => proxyFetchRaw<ReviewStats>(`/reviews/stats/${artisanId}`),
    enabled: Boolean(artisanId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<
    Review,
    Error,
    {
      contractId: string;
      rating: number;
      comment: string;
    }
  >({
    mutationFn: (input) =>
      proxyFetchRaw<Review>("/reviews", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
