"use client";

import { useJobs } from "@/features/jobs/api/useJobs";
import { JobStatusBadge } from "../../components/JobStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Search, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState } from "react";

export function AdminJobsWorkspace() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: jobsResponse, isLoading, error } = useJobs({ status: "UNDER_REVIEW", search });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Job Moderation</h2>
          <p className="text-sm text-muted-foreground mt-1">Review flagged jobs and manage marketplace safety.</p>
        </div>
      </div>

      <Card className="bg-amber-50/50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/20">
        <CardContent className="p-4 flex items-start gap-4">
          <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-500">Pending Reviews</h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">
              There are jobs awaiting moderation. Please review them to ensure they comply with our Terms of Service.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search flagged jobs..." 
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : error || !jobsResponse ? (
        <div className="text-sm text-destructive">Failed to load jobs.</div>
      ) : (jobsResponse.data || jobsResponse.jobs || []).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          No jobs currently under review.
        </div>
      ) : (
        <div className="grid gap-3">
          {(jobsResponse.data || jobsResponse.jobs || []).map((job: any) => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-full shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                      <span>Client ID: {job.clientId}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <JobStatusBadge status={job.status} />
                  <Button size="sm" onClick={() => router.push(`/admin/jobs/${job.id}`)}>
                    Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
