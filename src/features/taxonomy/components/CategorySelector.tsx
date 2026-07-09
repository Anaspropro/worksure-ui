"use client";

import { useCategories } from "../hooks/useTaxonomy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface CategorySelectorProps {
  value?: string;
  onChange?: (categoryId: string) => void;
  className?: string;
  placeholder?: string;
}

export function CategorySelector({
  value,
  onChange,
  className,
  placeholder = "Select a category...",
}: CategorySelectorProps) {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    return <div className="text-sm text-destructive">Failed to load categories</div>;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
