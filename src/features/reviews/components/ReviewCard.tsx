import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { RatingStars } from "./RatingStars";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Use a fallback if author details are not populated in the query
  const authorName = (review as any).author?.name || "User";
  const authorImage = (review as any).author?.image;
  const initial = authorName.charAt(0).toUpperCase();

  return (
    <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 border border-gray-100">
            <AvatarImage src={authorImage} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700">{initial}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{authorName}</div>
            <div className="text-xs text-gray-500">
              {review.visibleAt ? formatDistanceToNow(new Date(review.visibleAt), { addSuffix: true }) : "Hidden"}
            </div>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {review.comment || "No written feedback provided."}
      </p>

      {review.breakdown && Object.keys(review.breakdown).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-xs text-gray-500">
          {review.breakdown.workQuality && <span>Work: <strong className="text-gray-700">{review.breakdown.workQuality}★</strong></span>}
          {review.breakdown.communication && <span>Comm: <strong className="text-gray-700">{review.breakdown.communication}★</strong></span>}
          {review.breakdown.timeliness && <span>Time: <strong className="text-gray-700">{review.breakdown.timeliness}★</strong></span>}
        </div>
      )}
    </div>
  );
}
