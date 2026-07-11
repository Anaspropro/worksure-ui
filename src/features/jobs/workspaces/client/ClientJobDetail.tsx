"use client";

import { useJob } from "@/features/jobs/api/useJobs";
import { JobHeader } from "../../components/JobHeader";
import { JobTimeline } from "../../components/JobTimeline";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { ProposalComparisonList } from "@/features/proposals/components/ProposalComparisonList";
import { ReviewWorkspace } from "@/features/proposals/workspaces";
import { useProposals } from "@/features/jobs/api/useProposals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";

interface ClientJobDetailProps {
  jobId: string;
}

export function ClientJobDetail({ jobId }: ClientJobDetailProps) {
  const { data: job, isLoading, error } = useJob(jobId);
  const { data: proposalsResponse, isLoading: isProposalsLoading } = useProposals({ jobId });
  const proposals = proposalsResponse?.proposals;
  
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error || !job) {
    return <div className="text-sm text-destructive">Failed to load job details.</div>;
  }

  const selectedProposal = proposals?.find(p => p.id === selectedProposalId);

  return (
    <div className="space-y-6">
      <NextRequiredAction job={job as any} />
      
      <JobHeader job={job as any} />

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="proposals">
            Proposals
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {(job as any).proposalsCount || 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals" className="space-y-4">
          <ProposalComparisonList 
            jobId={jobId} 
            onSelectProposal={setSelectedProposalId} 
          />
        </TabsContent>
        
        <TabsContent value="details" className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Job Description</h3>
          <div className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
            {job.description}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>
          <JobTimeline jobId={job.id} />
        </TabsContent>
      </Tabs>

      <Sheet open={!!selectedProposalId} onOpenChange={(open) => !open && setSelectedProposalId(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Review Proposal</SheetTitle>
          </SheetHeader>
          
          {selectedProposalId && (
            <div className="h-[80vh]">
              <ReviewWorkspace 
                proposalId={selectedProposalId} 
                onClose={() => setSelectedProposalId(null)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
