"use client";

import { useJobs } from "@/features/jobs/api/useJobs";
import { CategoryBadge, SkillBadge } from "@/features/taxonomy";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Search, MapPin, DollarSign, Clock, Bookmark, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState } from "react";
import { MatchingScoreBadge } from "../../matching";

export function MarketplaceWorkspace() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: jobsResponse, isLoading, error } = useJobs({ status: "OPEN", search });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Job Marketplace</h2>
          <p className="text-sm text-muted-foreground mt-1">Find jobs that match your skills and expertise.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by keywords, skills, or title..." 
            className="pl-9 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>
      ) : error || !jobsResponse ? (
        <div className="text-sm text-destructive">Failed to load jobs.</div>
      ) : (() => {
        const jobsList = jobsResponse.data || jobsResponse.jobs || [];
        return jobsList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No open jobs found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-4">
            {jobsList.map((job: any) => (
              <Card key={job.id} className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => router.push(`/artisan/jobs/${job.id}`)}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.budget?.toLocaleString()} {job.budgetType === "HOURLY" ? "/ hr" : "Fixed"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.expectedDuration || "Duration TBD"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.isRemote ? "Remote" : job.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {/* Fake matching score for demo purposes */}
                        <MatchingScoreBadge score={Math.floor(Math.random() * 50) + 50} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {job.category && <CategoryBadge category={job.category} className="bg-muted/50" />}
                      {job.skills?.slice(0, 4).map((skill: any) => (
                        <SkillBadge key={skill.id} skill={skill} className="bg-muted/30" />
                      ))}
                      {job.skills && job.skills.length > 4 && (
                        <span className="text-xs text-muted-foreground font-medium px-2">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      })()}
    </div>
  );
}
