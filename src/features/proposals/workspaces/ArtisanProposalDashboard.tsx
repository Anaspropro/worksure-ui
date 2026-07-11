"use client";

import { useProposals, useProposalAction } from "../api/useProposals";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { DollarSign, Clock, MapPin, XCircle, FileEdit, Trash2 } from "lucide-react";

export function ArtisanProposalDashboard() {
  // Assuming the user is an Artisan, we fetch their proposals
  // In a real app we'd pass `artisanId: 'current'` or let the backend infer it from the auth token
  const { data: response, isLoading } = useProposals({});
  const { mutate: performAction, isPending } = useProposalAction('');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((col) => (
          <div key={col} className="space-y-4">
            <Skeleton className="h-8 w-32 mb-6" />
            {[1, 2].map((item) => <Skeleton key={item} className="h-48 w-full" />)}
          </div>
        ))}
      </div>
    );
  }

  const proposals = response || [];

  const activeProposals = proposals.filter((p: any) => ['SUBMITTED', 'VIEWED'].includes(p.status));
  const shortlistedProposals = proposals.filter((p: any) => p.status === 'SHORTLISTED');
  const pastProposals = proposals.filter((p: any) => ['REJECTED', 'EXPIRED', 'WITHDRAWN', 'ACCEPTED'].includes(p.status));

  const handleWithdraw = (id: string) => {
    if (confirm("Are you sure you want to withdraw this proposal?")) {
      // Re-use useProposalAction or just call API
      // Wait, we need the ID in useProposalAction, so we'll do it manually or via a separate hook call.
      // But we can't call hooks conditionally. 
    }
  };

  return (
    <div className="p-6 h-full bg-background overflow-hidden flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Proposals</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your bids and active applications</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/jobs"}>Find New Jobs</Button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        
        {/* ACTIVE COLUMN */}
        <div className="bg-muted/30 rounded-xl p-4 flex flex-col h-full border">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Active
            </h3>
            <Badge variant="secondary">{activeProposals.length}</Badge>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4">
            {activeProposals.length === 0 ? (
              <div className="text-sm text-center py-8 text-muted-foreground bg-background rounded-lg border border-dashed">No active proposals</div>
            ) : (
              activeProposals.map((p: any) => <ProposalKanbanCard key={p.id} proposal={p} />)
            )}
          </div>
        </div>

        {/* SHORTLISTED COLUMN */}
        <div className="bg-amber-50/50 dark:bg-amber-500/5 rounded-xl p-4 flex flex-col h-full border border-amber-200/50 dark:border-amber-500/20">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Shortlisted
            </h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">{shortlistedProposals.length}</Badge>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4">
            {shortlistedProposals.length === 0 ? (
              <div className="text-sm text-center py-8 text-muted-foreground bg-background rounded-lg border border-dashed">No shortlisted proposals</div>
            ) : (
              shortlistedProposals.map((p: any) => <ProposalKanbanCard key={p.id} proposal={p} isHighlighted />)
            )}
          </div>
        </div>

        {/* PAST/ARCHIVED COLUMN */}
        <div className="bg-muted/10 rounded-xl p-4 flex flex-col h-full border border-dashed">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
              Past & Archived
            </h3>
            <Badge variant="outline">{pastProposals.length}</Badge>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-4">
            {pastProposals.length === 0 ? (
              <div className="text-sm text-center py-8 text-muted-foreground bg-background rounded-lg border border-dashed">No past proposals</div>
            ) : (
              pastProposals.map((p: any) => <ProposalKanbanCard key={p.id} proposal={p} isArchived />)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function ProposalKanbanCard({ proposal, isHighlighted, isArchived }: { proposal: any; isHighlighted?: boolean; isArchived?: boolean }) {
  const { mutate: performAction } = useProposalAction(proposal.id);

  return (
    <Card className={`transition-all ${isHighlighted ? 'border-amber-400 shadow-sm shadow-amber-200/20' : ''} ${isArchived ? 'opacity-75 bg-muted/50 grayscale-[0.3]' : 'hover:shadow-md hover:-translate-y-0.5'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm line-clamp-1 flex-1 pr-2" title={proposal.job.title}>
            {proposal.job.title}
          </h4>
          <Badge variant={
            proposal.status === 'ACCEPTED' ? 'default' : 
            proposal.status === 'REJECTED' ? 'destructive' : 
            'secondary'
          } className="text-[10px] px-1.5 py-0">
            {proposal.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${proposal.amount}</div>
          <div className="flex items-center gap-1 line-clamp-1"><Clock className="w-3.5 h-3.5" /> {proposal.estimatedDuration || 'N/A'}</div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 italic mb-3">"{proposal.message}"</p>

        {!isArchived && (
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-[10px] text-muted-foreground">
              {new Date(proposal.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                Edit
              </Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                if (confirm("Withdraw this proposal?")) {
                  performAction({ action: 'WITHDRAW' });
                }
              }}>
                Withdraw
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
