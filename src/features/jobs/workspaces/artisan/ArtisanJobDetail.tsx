"use client";

import { useJob } from "@/features/jobs/api/useJobs";
import { JobHeader } from "../../components/JobHeader";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useProposals } from "@/features/jobs/api/useProposals";
import { useUser } from "@/features/auth";
import { CheckCircle2, Info, FileEdit, ShieldCheck, Clock, MapPin, Wallet, User, Calendar, Award } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ProposalSubmissionForm } from "@/features/proposals/components/ProposalSubmissionForm";
import { Badge } from "@/shared/components/ui/badge";

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <NextRequiredAction job={job} />
      
      <JobHeader job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Job Description Card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                Job Description & Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
                {job.description}
              </div>

              {job.requirements && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Additional Requirements
                  </h4>
                  <p className="text-sm text-foreground">{job.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Proposal Submission / Draft Form Card (Positioned Directly Below Job Description) */}
          {isSubmitted && myProposal ? (
            <Card className="bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20 shadow-sm">
              <CardHeader className="pb-3 border-b border-emerald-200/60 dark:border-emerald-500/20">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Proposal Submitted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="text-sm text-emerald-700 dark:text-emerald-400">
                  You have submitted a proposal for this job. The client is currently reviewing all submitted applications.
                </div>
                <div className="bg-background rounded-lg p-4 border text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Your Submitted Bid:</span>
                    <span className="font-bold text-base text-foreground">
                      {formatCurrency((myProposal as any).amount || (myProposal as any).bidAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Status:</span>
                    <Badge variant="default" className="bg-emerald-600">
                      {myProposal.status}
                    </Badge>
                  </div>
                  {(myProposal as any).estimatedDuration && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Estimated Duration:</span>
                      <span className="text-foreground font-medium">{(myProposal as any).estimatedDuration}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/dashboard/artisan/proposals"}
                >
                  View All My Proposals
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border shadow-sm">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {myProposal?.status === "DRAFT" ? (
                    <>
                      <FileEdit className="h-5 w-5 text-amber-500" /> Resume & Edit Draft Proposal
                    </>
                  ) : (
                    <>
                      <Award className="h-5 w-5 text-primary" /> Submit a Proposal
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {job.status !== "OPEN" ? (
                  <Alert className="bg-muted border border-border">
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

        {/* Right Sidebar Details Area */}
        <div className="space-y-6">
          {/* Summary Details Card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Project Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-600" /> Client Budget
                </span>
                <strong className="text-foreground">{formatCurrency(job.budget || 0)}</strong>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" /> Category
                </span>
                <span className="font-medium text-foreground truncate max-w-[140px]">
                  {job.category || "General"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" /> Location
                </span>
                <span className="font-medium text-foreground">
                  {job.location || "Remote"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Safety & Escrow Banner */}
          <Card className="border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="h-5 w-5" /> WorkSure Escrow Protected
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your funds are held securely in Escrow until project milestones are completed and verified.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
