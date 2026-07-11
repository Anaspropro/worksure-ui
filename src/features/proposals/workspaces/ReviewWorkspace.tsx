import { useState } from 'react';
import { useProposal, useProposalAction } from '../api/useProposals';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CheckCircle2, ChevronRight, CheckCircle, Clock, DollarSign, Calendar, Paperclip, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface ReviewWorkspaceProps {
  proposalId: string;
  onClose: () => void;
  onAccepted?: () => void;
}

const STEPS = ['Details', 'Attachments', 'Artisan Snapshot', 'Acceptance'];

export function ReviewWorkspace({ proposalId, onClose, onAccepted }: ReviewWorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: proposal, isLoading } = useProposal(proposalId);
  const { mutate: performAction, isPending } = useProposalAction(proposalId);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleAccept = () => {
    performAction(
      { action: 'ACCEPT' },
      { 
        onSuccess: () => {
          onAccepted?.();
          onClose();
        } 
      }
    );
  };

  const handleReject = () => {
    performAction(
      { action: 'REJECT' },
      { 
        onSuccess: () => {
          onClose();
        } 
      }
    );
  };

  if (isLoading) {
    return <div className="space-y-4 p-6"><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!proposal) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Stepper Header */}
      <div className="border-b px-6 py-4 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
                idx < currentStep ? 'bg-primary border-primary text-primary-foreground' :
                idx === currentStep ? 'border-primary text-primary' : 'border-muted text-muted-foreground'
              }`}>
                {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <div className="hidden sm:block ml-3">
                <p className={`text-sm font-medium ${idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${idx < currentStep ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold">Proposal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Bid Amount</div>
                  <div className="text-2xl font-semibold mt-1">${proposal.amount.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4"/> Duration</div>
                  <div className="text-2xl font-semibold mt-1">{proposal.estimatedDuration || 'Not provided'}</div>
                </CardContent>
              </Card>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cover Letter</h4>
              <div className="bg-muted/30 p-5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap border border-border/50">
                {proposal.message}
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold">Attachments</h3>
            {(!proposal.attachments || proposal.attachments.length === 0) ? (
              <div className="text-center py-12 bg-muted/20 border border-dashed rounded-lg text-muted-foreground">
                No attachments included in this proposal.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proposal.attachments.map((att: any) => (
                  <a href={att.fileUrl} target="_blank" rel="noreferrer" key={att.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded text-primary">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{att.fileName}</p>
                      <p className="text-xs text-muted-foreground">{(att.fileSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold">Artisan Snapshot</h3>
            <p className="text-sm text-muted-foreground">This is exactly how the Artisan's profile looked at the time they submitted this proposal.</p>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarFallback>{proposal.artisan.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold flex items-center gap-1.5">
                      {proposal.artisan.name}
                      {proposal.artisan.artisanProfile?.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">Snapshot Rating: {proposal.artisan.artisanProfile?.rating || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold">Accept Proposal & Create Contract</h3>
            
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold text-sm">Transactional Action</h5>
                <p className="text-sm mt-1 opacity-90">
                  Accepting this proposal will automatically reject all other active proposals for this job and immediately draft a new Contract. 
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg text-center mt-6">
              <p className="text-lg font-medium mb-6">Are you ready to hire {proposal.artisan.name}?</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" size="lg" onClick={handleReject} disabled={isPending}>
                  Reject Proposal
                </Button>
                <Button size="lg" onClick={handleAccept} disabled={isPending}>
                  {isPending ? 'Processing...' : 'Accept & Create Contract'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="border-t p-4 flex justify-between bg-muted/10">
        <Button variant="ghost" onClick={currentStep === 0 ? onClose : handlePrev}>
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>
        {currentStep < STEPS.length - 1 && (
          <Button onClick={handleNext}>
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
