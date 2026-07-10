"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/features/auth";
import { useContracts } from "@/features/contracts";
import { useCreateReview, useMyReviews, useReviews } from "@/features/reviews/api/useReviews";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Star, MessageSquareQuote, Info } from "lucide-react";





function StarRating({ rating, setRating, readOnly = false }: { rating: number, setRating?: (r: number) => void, readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => setRating?.(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"} focus:outline-none`}
        >
          <Star
            className={`size-5 ${star <= rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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
    <main 
      className="space-y-6"
    >
      <div>
        <Card className="border-border bg-card shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <MessageSquareQuote className="size-40" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl tracking-tight text-foreground">Reviews & Reputation</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Reviews help both sides understand delivery quality, communication, and trust after a completed contract.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {user.role === "CLIENT" ? (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Card className="border-border bg-card shadow-sm h-full transition-colors hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="size-5 text-primary" />
                  Leave a Review
                </CardTitle>
                <CardDescription>Reviews should follow a completed contract so they stay tied to real work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Contract</label>
                  <select
                    className="h-11 w-full rounded-lg border border-border/50 bg-background/50 px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    value={contractId}
                    onChange={(event) => setContractId(event.target.value)}
                  >
                    <option value="">Select a contract to review...</option>
                    {availableContracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.job.title} ({formatCurrency(contract.amount)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</label>
                  <div className="p-3 bg-background/50 border border-border/50 rounded-lg inline-flex">
                    <StarRating rating={rating} setRating={setRating} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Experience</label>
                  <Textarea
                    placeholder="How did the work go? Be specific about quality and communication..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    className="bg-background/50 border-border/50 focus-visible:ring-primary/20 min-h-[100px] resize-none"
                  />
                </div>

                <Button
                  className="w-full mt-2 shadow-sm"
                  disabled={!contractId || !comment.trim() || rating < 1 || rating > 5 || createReviewMutation.status === "pending"}
                  onClick={() => {
                    createReviewMutation.mutate({ contractId, rating, comment });
                    setContractId("");
                    setComment("");
                    setRating(5);
                  }}
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-border bg-card shadow-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="size-5 text-primary" />
                  Why This Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-foreground/90">
                  <p>Reviews create long-term trust signals beyond a single contract. They are most useful when attached to specific completed work.</p>
                  <p className="mt-2">Over time, this becomes a meaningful marketplace reputation layer that helps other clients make informed decisions.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      <div>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>{user.role === "ARTISAN" ? "Reviews About Your Work" : "Your Submitted Reviews"}</CardTitle>
            <CardDescription>Review history is grouped here so it is easy to reference during future work.</CardDescription>
          </CardHeader>
          <CardContent>
            {visibleReviews.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                  {visibleReviews.map((review, index) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-border/50 bg-background/40 p-5 flex flex-col justify-between transition-all hover:bg-background/60 hover:border-primary/30 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <StatusBadge status={review.isPublic ? "completed" : "pending"} />
                          <StarRating rating={review.rating} readOnly />
                        </div>
                        <p className="font-semibold text-foreground line-clamp-1 mb-2">
                          {review.contract?.jobTitle ?? `Contract ${review.contractId}`}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">&quot;{review.comment}&quot;</p>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        <span>{user.role === "ARTISAN" ? `By ${review.client.name}` : `For ${review.artisan.name}`}</span>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-surface-muted/30 p-12 text-center flex flex-col items-center justify-center">
                <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Star className="size-8 text-muted-foreground/40" />
                </div>
                <p className="text-base font-semibold text-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">Completed contract feedback will start to build reputation here once work is finalized.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
