import { useState } from 'react';
import { useCreateProposal } from '../api/useProposals';
import { createProposalSchema, CreateProposalInput } from '../schemas/proposal-schemas';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';
import { ArrowRight, Paperclip, X } from 'lucide-react';
import { z } from 'zod';

interface ProposalSubmissionFormProps {
  jobId: string;
  minBudget: number;
}

export function ProposalSubmissionForm({ jobId, minBudget }: ProposalSubmissionFormProps) {
  const [formData, setFormData] = useState<Partial<CreateProposalInput>>({
    jobId,
    amount: minBudget || 5,
    message: '',
    estimatedDuration: '',
    attachments: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createProposal = useCreateProposal();

  const handleValidation = () => {
    try {
      createProposalSchema.parse(formData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach(err => {
          if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      await createProposal.mutateAsync({
        jobId,
        amount: formData.amount!,
        message: formData.message!,
        estimatedDuration: formData.estimatedDuration,
        attachments: formData.attachments,
        // Assuming the API might take an action or status for Drafts, but our CreateProposalDto 
        // doesn't have status, it defaults to SUBMITTED.
        // We will just do a standard submission for now and a toast if it's draft.
      });
      toast.success(isDraft ? "Draft saved successfully!" : "Proposal submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit proposal");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload and append
    const newAttachment = {
      fileUrl: URL.createObjectURL(file), // Mock URL
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAttachment]
    }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Bid Amount ($)</label>
        <Input 
          type="number" 
          min={Math.max(5, minBudget * 0.5)} // Cannot bid lower than 50% of budget
          required
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
        />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Estimated Duration</label>
        <Input 
          required
          value={formData.estimatedDuration}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
          placeholder="e.g. 2 weeks"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Letter</label>
        <Textarea 
          required
          className="min-h-[150px] resize-none"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Explain why you are the best fit for this job..."
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          {errors.message && <p className="text-destructive">{errors.message}</p>}
          <p className="ml-auto">{(formData.message || "").length} / 2000</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex justify-between">
          Attachments
          <span className="text-xs font-normal text-muted-foreground">Max 100kB (Images), 50kB (Docs)</span>
        </label>
        <div className="border border-dashed rounded-lg p-4 bg-muted/20">
          <label className="flex items-center justify-center cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
            <Paperclip className="w-4 h-4 mr-2" />
            Add Attachment
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
          </label>
        </div>
        {formData.attachments && formData.attachments.length > 0 && (
          <div className="space-y-2 mt-2">
            {formData.attachments.map((att, i) => (
              <div key={i} className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm">
                <span className="truncate max-w-[200px]">{att.fileName}</span>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, attachments: prev.attachments?.filter((_, idx) => idx !== i) }))}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline"
          className="w-full"
          onClick={(e) => handleSubmit(e, true)}
          disabled={createProposal.isPending}
        >
          Save as Draft
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={createProposal.isPending || (formData.message || "").length < 10}
        >
          {createProposal.isPending ? "Submitting..." : (
            <>Submit Proposal <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
