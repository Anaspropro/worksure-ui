import { Badge } from "@/shared/components/ui/badge";
import { Star, Award, ShieldCheck } from "lucide-react";

interface ReputationBadgeProps {
  jssScore?: number;
  totalReviews: number;
  averageRating: number;
  type?: "artisan" | "client";
}

export function ReputationBadge({ jssScore, totalReviews, averageRating, type = "artisan" }: ReputationBadgeProps) {
  if (totalReviews === 0) {
    return <Badge variant="secondary" className="bg-gray-100 text-gray-600">New</Badge>;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center text-yellow-600 font-semibold bg-yellow-50 px-2 py-1 rounded-md text-sm">
        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
        {averageRating.toFixed(1)} ({totalReviews})
      </div>
      
      {type === "artisan" && typeof jssScore === "number" && (
        <Badge variant={jssScore >= 90 ? "default" : "secondary"} className={jssScore >= 90 ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
          {jssScore >= 90 && <Award className="w-3 h-3 mr-1" />}
          {jssScore}% JSS
        </Badge>
      )}

      {type === "client" && (
        <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Trusted
        </Badge>
      )}
    </div>
  );
}
