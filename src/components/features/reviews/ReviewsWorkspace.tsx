"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useAuth";
import { useContracts } from "@/hooks/useContracts";
import { useCreateReview, useMyReviews, useReviews } from "@/hooks/useReviews";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ReviewsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  const contractsQuery = useContracts({ status: "COMPLETED" }, { enabled: canLoadProtectedData });
  const myReviewsQuery = useMyReviews({
    enabled: canLoadProtectedData && user?.role !== "ARTISAN",
  });
  const reviewsQuery = useReviews(
    user?.role === "ARTISAN" ? { artisanId: user.id } : { clientId: user?.id },
    { enabled: canLoadProtectedData && user?.role === "ARTISAN" },
  );
  const createReviewMutation = useCreateReview();

  const [contractId, setContractId] = useState("");
  const [ratingInput, setRatingInput] = useState("5");
  const [comment, setComment] = useState("");
  const rating = Number(ratingInput || 0);

  const availableContracts = useMemo(
    () =>
      (contractsQuery.data?.data ?? []).filter((contract) =>
        user?.role === "CLIENT" ? contract.clientId === user.id : contract.artisanId === user?.id,
      ),
    [contractsQuery.data, user],
  );

  if (!user) {
    return null;
  }

  const visibleReviews = user.role === "ARTISAN" ? reviewsQuery.data ?? [] : myReviewsQuery.data ?? [];

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Reviews and Reputation</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Reviews help both sides understand delivery quality, communication, and trust after a completed contract.
          </CardDescription>
        </CardHeader>
      </Card>

      {user.role === "CLIENT" ? (
        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/80 bg-card">
            <CardHeader>
              <CardTitle>Leave a review</CardTitle>
              <CardDescription>Reviews should follow a completed contract so they stay tied to real work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={contractId}
                onChange={(event) => setContractId(event.target.value)}
              >
                <option value="">Select completed contract</option>
                {availableContracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.job.title} ({formatCurrency(contract.amount)})
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={1}
                max={5}
                value={ratingInput}
                onChange={(event) => setRatingInput(event.target.value)}
                placeholder="Rating from 1 to 5"
              />
              <Textarea
                placeholder="How did the work go?"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <Button
                disabled={!contractId || !comment.trim() || rating < 1 || rating > 5 || createReviewMutation.status === "pending"}
                onClick={() =>
                  createReviewMutation.mutate({
                    contractId,
                    rating,
                    comment,
                  })
                }
              >
                Submit review
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-secondary-light/20">
            <CardHeader>
              <CardTitle>Why this matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Reviews create long-term trust signals beyond a single contract.</p>
              <p>They are most useful when attached to specific completed work.</p>
              <p>Over time, this becomes a meaningful marketplace reputation layer.</p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle>{user.role === "ARTISAN" ? "Reviews about your work" : "Your submitted reviews"}</CardTitle>
          <CardDescription>Review history is grouped here so it is easy to reference during future work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleReviews.length ? (
            visibleReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border bg-background/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {review.contract?.jobTitle ?? `Contract ${review.contractId}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Rating: {review.rating}/5</p>
                  </div>
                  <StatusBadge status={review.isPublic ? "completed" : "pending"} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{formatDate(review.createdAt)}</span>
                  <span>{user.role === "ARTISAN" ? `By ${review.client.name}` : `For ${review.artisan.name}`}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground">
              No reviews yet. Completed contract feedback will start to build reputation here.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
