import { useProposalCompare } from '../api/useProposals';
import { components } from '@/shared/api/generated/schema';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { CheckCircle, Clock, Star, Paperclip, Zap } from 'lucide-react';

type ProposalComparisonItemDto = components['schemas']['ProposalComparisonItemDto'];

interface ProposalComparisonListProps {
  jobId: string;
  onSelectProposal: (id: string) => void;
}

export function ProposalComparisonList({ jobId, onSelectProposal }: ProposalComparisonListProps) {
  const { data: proposals, isLoading, error } = useProposalCompare(jobId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !proposals) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        Failed to load proposal comparisons.
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="p-12 text-center bg-muted/30 border border-dashed rounded-xl">
        <h3 className="text-lg font-medium text-muted-foreground">No proposals to compare</h3>
        <p className="text-sm text-muted-foreground mt-2">Wait for artisans to submit proposals to this job.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((p) => (
        <ComparisonCard 
          key={p.id} 
          proposal={p} 
          onSelect={() => onSelectProposal(p.id)} 
        />
      ))}
    </div>
  );
}

function ComparisonCard({ proposal, onSelect }: { proposal: ProposalComparisonItemDto; onSelect: () => void }) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${proposal.recommended ? 'border-primary ring-1 ring-primary/20' : ''}`}>
      {proposal.recommended && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Zap className="w-3 h-3" /> Recommended
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={proposal.artisanAvatarUrl || ''} />
              <AvatarFallback>{proposal.artisanName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-1.5">
                {proposal.artisanName}
                {proposal.verificationStatus && <CheckCircle className="w-4 h-4 text-green-500" />}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" /> {proposal.rating.toFixed(1)}
                </span>
                {proposal.completionRate !== undefined && (
                  <>
                    <span>•</span>
                    <span>{Math.round(proposal.completionRate)}% Success</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Bid Amount</div>
            <div className="font-semibold">${proposal.bid.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Duration</div>
            <div className="font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              {proposal.duration || 'Not specified'}
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Cover Letter Preview</div>
          <p className="text-sm text-foreground/80 line-clamp-3 italic">"{proposal.coverLetterPreview}..."</p>
        </div>

        {proposal.attachmentCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Paperclip className="w-4 h-4" />
            <span>{proposal.attachmentCount} attachment{proposal.attachmentCount > 1 ? 's' : ''} included</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant={proposal.recommended ? 'default' : 'outline'} className="w-full" onClick={onSelect}>
          Review Full Proposal
        </Button>
      </CardFooter>
    </Card>
  );
}
