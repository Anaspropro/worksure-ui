"use client";

import { useJobs } from "@/features/jobs/api/useJobs";
import { useUser } from "@/features/auth";
import { JobStatusBadge } from "../../components/JobStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Plus, Users, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ClientJobsWorkspace() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: jobsResponse, isLoading, error } = useJobs(
    { clientId: user?.id },
    { enabled: !!user?.id }
  );

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>;
  }

  if (error || !jobsResponse) {
    return <div className="text-sm text-destructive">Failed to load jobs.</div>;
  }

  const jobs = jobsResponse.data || jobsResponse.jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Job Postings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your job postings and review proposals.</p>
        </div>
        <Button onClick={() => router.push("/jobs/create")}>
          <Plus className="mr-2 h-4 w-4" /> Post a Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Create your first job posting to start receiving proposals from talented artisans.
            </p>
            <Button onClick={() => router.push("/jobs/create")}>
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg hover:underline">{job.title}</h3>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {job.proposalsCount} Proposals
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="w-fit self-end md:self-center">
                    Manage <ArrowRight className="ml-2 h-4 w-4" />
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
