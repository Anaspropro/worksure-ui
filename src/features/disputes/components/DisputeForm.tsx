import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useCreateDispute } from "../api/create-dispute";
import { createDisputeSchema, CreateDisputeInput } from "../schemas";
import { EvidenceUploader } from "./EvidenceUploader";
import { AlertCircle, FileWarning, ArrowRight, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { toast } from "sonner";

interface DisputeFormProps {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DISPUTE_REASONS = [
  "Non-delivery of work",
  "Quality of work unacceptable",
  "Communication breakdown",
  "Scope creep / Unpaid extra work",
  "Missed deadlines",
  "Other"
];

export function DisputeForm({ contractId, open, onOpenChange, onSuccess }: DisputeFormProps) {
  const { mutate: createDispute, isPending } = useCreateDispute();
  const [step, setStep] = useState<1 | 2>(1);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CreateDisputeInput>({
    resolver: zodResolver(createDisputeSchema),
    defaultValues: {
      contractId,
      reason: "",
      description: "",
      evidenceUrls: [],
    },
  });

  const nextStep = async () => {
    const isValid = await trigger(["reason", "description", "amountClaimed"]);
    if (isValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: CreateDisputeInput) => {
    // Phase 4: Mock evidence upload to cloud storage
    // We will generate fake URLs based on file names for now, 
    // simulating a real file upload.
    let uploadedUrls: string[] = [];
    
    if (evidenceFiles.length > 0) {
      const toastId = toast.loading("Uploading evidence...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      uploadedUrls = evidenceFiles.map(f => `https://storage.worksure.com/evidence/${f.name}`);
      toast.success("Evidence uploaded", { id: toastId });
    }

    const payload = {
      ...data,
      evidenceUrls: uploadedUrls,
    };
    
    createDispute(payload, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
        setStep(1);
        setEvidenceFiles([]);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setStep(1);
        setEvidenceFiles([]);
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Raise a Dispute</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Provide details about the issue you are facing." : "Upload evidence to support your claim."}
          </DialogDescription>
        </DialogHeader>

        {/* Wizard Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 my-2">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Opening a dispute will freeze contract funds. This action cannot be easily undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Dispute</label>
                <Select onValueChange={(value) => setValue("reason", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPUTE_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && (
                  <span className="text-xs text-destructive">{errors.reason.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Claimed (Optional)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register("amountClaimed", { valueAsNumber: true })}
                />
                {errors.amountClaimed && (
                  <span className="text-xs text-destructive">{errors.amountClaimed.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Description</label>
                <Textarea
                  {...register("description")}
                  placeholder="Provide a detailed description of the issue. Explain what went wrong and what you expect as a resolution..."
                  rows={5}
                />
                {errors.description && (
                  <span className="text-xs text-destructive">{errors.description.message}</span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <Alert className="bg-primary/5 text-primary border-none">
                <FileWarning className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Strong evidence helps administrators resolve disputes faster.
                  Include screenshots of work, chat histories outside the platform, or any other relevant files.
                </AlertDescription>
              </Alert>

              <EvidenceUploader 
                files={evidenceFiles}
                onFilesChange={setEvidenceFiles}
              />
            </div>
          )}

          <div className="flex justify-between space-x-2 pt-4 border-t border-border mt-6">
            {step === 1 ? (
              <>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={nextStep} className="gap-2">
                  Next Step <ArrowRight className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button type="submit" variant="destructive" disabled={isPending}>
                  {isPending ? "Submitting Dispute..." : "Submit Dispute"}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
