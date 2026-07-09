import { Badge } from "@/shared/components/ui/badge";
import { Folder } from "lucide-react";
import { Category } from "../types";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge variant="secondary" className={className}>
      <Folder className="mr-1 h-3 w-3 text-muted-foreground" />
      {category.name}
    </Badge>
  );
}
