"use client";

import { useJob } from "@/features/jobs/api/useJobs";
import { JobHeader } from "../../components/JobHeader";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useProposals } from "@/features/jobs/api/useProposals";
import { useUser } from "@/features/auth";
import { CheckCircle2, Info, FileEdit } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ProposalSubmissionForm } from "@/features/proposals/components/ProposalSubmissionForm";

interface ArtisanJobDetailProps {
  jobId: string;
}

export function ArtisanJobDetail({ jobId }: ArtisanJobDetailProps) {
  const { data: job, isLoading, error } = useJob(jobId);
  const { data: user } = useUser();
  const { data: proposalsResponse } = useProposals({ jobId });
  const proposals = proposalsResponse?.proposals;
  
  const myProposal = proposals?.find(
    (p: any) => user ? (p.artisan?.id === user.id || p.artisanId === user.id) : false
  );
  const isSubmitted = Boolean(
    myProposal &&
    myProposal.status !== "DRAFT" &&
    myProposal.status !== "WITHDRAWN"
  );

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error || !job) {
    return <div className="text-sm text-destructive">Failed to load job details.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <NextRequiredAction job={job} />
      
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
          {isSubmitted && myProposal ? (
            <Card className="bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Proposal Submitted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-emerald-700 dark:text-emerald-500">
                  You have submitted a proposal for this job. The client is currently reviewing all applications.
                </div>
                <div className="bg-background rounded-md p-3 border text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Bid:</span>
                    <span className="font-medium">${((myProposal as any).amount || (myProposal as any).bidAmount)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{myProposal.status}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard/artisan/proposals"}>
                  View My Proposals
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {myProposal?.status === "DRAFT" ? (
                    <>
                      <FileEdit className="h-5 w-5 text-amber-500" /> Edit Draft Proposal
                    </>
                  ) : (
                    "Submit a Proposal"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.status !== "OPEN" ? (
                  <Alert className="bg-muted">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This job is no longer accepting new proposals.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ProposalSubmissionForm 
                    jobId={job.id} 
                    minBudget={job.budget || 5} 
                    initialProposal={myProposal}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
