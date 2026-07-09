import { Badge } from "@/shared/components/ui/badge";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchingScoreBadgeProps {
  score: number; // 0 to 100
  className?: string;
}

export function MatchingScoreBadge({ score, className }: MatchingScoreBadgeProps) {
  let colorClass = "bg-red-50 text-red-700 border-red-200";
  
  if (score >= 80) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  } else if (score >= 50) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
  } else {
    colorClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
  }

  return (
    <Badge variant="outline" className={cn("inline-flex items-center gap-1 font-medium font-mono", colorClass, className)}>
      <Zap className="h-3 w-3" />
      {score}% Match
    </Badge>
  );
}
