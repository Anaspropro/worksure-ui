"use client";

import { useJobs } from "../../hooks/useJobs";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Bookmark, ArrowRight } from "lucide-react";

export function SavedJobsList() {
  const router = useRouter();
  // Using a mock filter for saved jobs
  const { data: jobsResponse, isLoading, error } = useJobs({ saved: true });

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>;
  }

  if (error || !jobsResponse) {
    return <div className="text-sm text-destructive">Failed to load saved jobs.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Saved Jobs</h2>
        <p className="text-sm text-muted-foreground mt-1">Jobs you have bookmarked for later.</p>
      </div>

      {jobsResponse.data.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              You haven't saved any jobs yet. Browse the marketplace and bookmark jobs you're interested in.
            </p>
            <Button onClick={() => router.push("/artisan/jobs")}>
              Browse Marketplace
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobsResponse.data.map((job) => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{job.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/artisan/jobs/${job.id}`)}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
