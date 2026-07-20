"use client";

import { useProposals, useProposalAction } from "../api/useProposals";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { DollarSign, Clock, MapPin, XCircle, FileEdit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/shared/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalKeys } from "../api/useProposals";

export function ArtisanProposalDashboard() {
  // Assuming the user is an Artisan, we fetch their proposals
  // In a real app we'd pass `artisanId: 'current'` or let the backend infer it from the auth token
  const { data: response, isLoading } = useProposals({});
  // We cannot use `useProposalAction` here since it requires an ID on initialization. 
  // Instead, we rely on a custom wrapper or just the queryClient mutation natively if needed, 
  // but let's assume we refactored it or we map over items to pass IDs. 
  // Actually, we can use the apiClient directly here for list-based actions, or create a list action hook.
  // Wait, I will use apiClient directly to keep it simple, since `useProposalAction` binds to one ID.
  const queryClient = useQueryClient();
  
  const withdrawMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await apiClient.PATCH('/proposals/{id}/withdraw', {
        params: { path: { id } }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    }
  });

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

  const proposals = response?.proposals || [];

  const activeProposals = proposals.filter((p: any) => ['SUBMITTED', 'VIEWED'].includes(p.status));
  const draftProposals = proposals.filter((p: any) => p.status === 'DRAFT');
  const shortlistedProposals = proposals.filter((p: any) => p.status === 'SHORTLISTED');
  const pastProposals = proposals.filter((p: any) => ['REJECTED', 'EXPIRED', 'WITHDRAWN', 'ACCEPTED'].includes(p.status));


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
            {activeProposals.length === 0 && draftProposals.length === 0 && (
              <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                No active proposals.
              </div>
            )}
            {draftProposals.map((p: any) => (
              <ProposalMiniCard key={p.id} proposal={p} onEdit={() => window.location.href = `/jobs/${p.jobId}?editDraft=${p.id}`} />
            ))}
            {activeProposals.map((p: any) => <ProposalKanbanCard key={p.id} proposal={p} onWithdraw={() => withdrawMutation.mutate(p.id)} />)}
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
              shortlistedProposals.map((p: any) => <ProposalKanbanCard key={p.id} proposal={p} isHighlighted onWithdraw={() => withdrawMutation.mutate(p.id)} />)
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

function ProposalMiniCard({ proposal, onEdit }: { proposal: any; onEdit: () => void }) {
  return (
    <Card className="p-3 border-dashed border-muted-foreground/20">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-amber-600">Draft</span>
        <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
      </div>
      <p className="text-sm truncate">{proposal.job.title}</p>
    </Card>
  );
}

function ProposalKanbanCard({ proposal, isHighlighted, isArchived, onWithdraw }: { proposal: any; isHighlighted?: boolean; isArchived?: boolean; onWithdraw?: () => void }) {
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
              <Button variant="outline" size="sm" className="w-full text-xs h-8 text-destructive hover:bg-destructive hover:text-white" onClick={() => {
                if (confirm("Withdraw this proposal?")) {
                  onWithdraw?.();
                }
              }}>
                <Trash2 className="w-3 h-3 mr-1"/> Withdraw
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
