"use client";

import * as React from "react";
import { useSkillsByCategory, useSkillSearch } from "../hooks/useTaxonomy";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skill } from "../types";

interface SkillAutocompleteProps {
  categoryId?: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function SkillAutocomplete({
  categoryId,
  selectedIds,
  onChange,
  className,
}: SkillAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data: categorySkills } = useSkillsByCategory(categoryId || "");
  const { data: searchResults, isLoading: isSearching } = useSkillSearch(search);

  // If we have a search term, show search results. Otherwise show skills for the category (if any).
  const displayedSkills = search.length > 0 ? searchResults : categorySkills;

  const toggleSkill = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeSkill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((s) => s !== id));
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedIds.length === 0 ? "Select skills..." : `${selectedIds.length} skills selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex flex-col">
            <div className="p-2 border-b">
              <Input
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto p-1">
              {isSearching && <div className="p-2 text-sm text-muted-foreground text-center">Searching...</div>}
              {!isSearching && displayedSkills?.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">No skills found.</div>
              )}
              {!isSearching &&
                displayedSkills?.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent",
                      selectedIds.includes(skill.id) && "bg-accent/50"
                    )}
                  >
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedIds.includes(skill.id) && <Check className="h-4 w-4" />}
                    </div>
                    {skill.name}
                  </div>
                ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected skill chips display */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedIds.map((id) => {
            // Find the skill object to display its name
            const skill =
              displayedSkills?.find((s) => s.id === id) ||
              { id, name: "Skill " + id } as Skill; // Fallback if not loaded
            
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {skill.name}
                <button
                  onClick={(e) => removeSkill(id, e)}
                  className="rounded-full hover:bg-muted ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
