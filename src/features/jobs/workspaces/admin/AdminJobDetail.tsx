"use client";

import { useJob, useUpdateJobStatus } from "../../hooks/useJobs";
import { JobHeader } from "../../components/JobHeader";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, Ban, AlertTriangle } from "lucide-react";
import { JobTimeline } from "../../components/JobTimeline";

interface AdminJobDetailProps {
  jobId: string;
}

export function AdminJobDetail({ jobId }: AdminJobDetailProps) {
  const { data: job, isLoading, error } = useJob(jobId);
  const updateStatus = useUpdateJobStatus();

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error || !job) {
    return <div className="text-sm text-destructive">Failed to load job details.</div>;
  }

  const handleApprove = async () => {
    try {
      await updateStatus.mutateAsync({ id: job.id, status: "OPEN" });
      toast.success("Job approved and published.");
    } catch (err) {
      toast.error("Failed to approve job.");
    }
  };

  const handleCancel = async () => {
    try {
      await updateStatus.mutateAsync({ id: job.id, status: "CANCELLED" });
      toast.success("Job cancelled and removed from marketplace.");
    } catch (err) {
      toast.error("Failed to cancel job.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <NextRequiredAction job={job} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-sm">Moderation Actions</h3>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
            disabled={updateStatus.isPending || job.status !== "UNDER_REVIEW"}
          >
            <Ban className="mr-2 h-4 w-4" /> Cancel Job
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleApprove}
            disabled={updateStatus.isPending || job.status !== "UNDER_REVIEW"}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Publish
          </Button>
        </div>
      </div>

      <JobHeader job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
                {job.description}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation History</CardTitle>
            </CardHeader>
            <CardContent>
              <JobTimeline jobId={job.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
