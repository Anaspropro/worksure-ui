import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function RatingStars({ rating, max = 5, size = "md", className, showText = false }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = max - fullStars - (partialStar > 0 ? 1 : 0);

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn("text-yellow-400 fill-yellow-400", starSizes[size])} />
        ))}
        {partialStar > 0 && (
          <div className="relative">
            <Star className={cn("text-gray-300", starSizes[size])} />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
              <Star className={cn("text-yellow-400 fill-yellow-400", starSizes[size])} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn("text-gray-300", starSizes[size])} />
        ))}
      </div>
      {showText && <span className="text-sm text-gray-600 font-medium ml-2">{rating.toFixed(1)}</span>}
    </div>
  );
}
