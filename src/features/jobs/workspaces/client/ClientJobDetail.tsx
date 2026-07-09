"use client";

import { useJob } from "../../hooks/useJobs";
import { JobHeader } from "../../components/JobHeader";
import { JobTimeline } from "../../components/JobTimeline";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { useJobProposals, ProposalCard, ProposalDetail, ProposalActions } from "../../proposals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";

interface ClientJobDetailProps {
  jobId: string;
}

export function ClientJobDetail({ jobId }: ClientJobDetailProps) {
  const { data: job, isLoading, error } = useJob(jobId);
  const { data: proposals, isLoading: isProposalsLoading } = useJobProposals(jobId);
  
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
      <NextRequiredAction job={job} />
      
      <JobHeader job={job} />

      <Tabs defaultValue="proposals" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="proposals">
            Proposals
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {job.proposalsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="proposals" className="space-y-4">
          {isProposalsLoading ? (
            <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
          ) : !proposals || proposals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              No proposals received yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {proposals.map(proposal => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal} 
                  onClick={() => setSelectedProposalId(proposal.id)}
                />
              ))}
            </div>
          )}
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
          
          {selectedProposal && (
            <div className="space-y-8 pb-12">
              <ProposalDetail proposal={selectedProposal} />
              
              <div className="border-t pt-6 mt-6">
                <ProposalActions proposal={selectedProposal} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
