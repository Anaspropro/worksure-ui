import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useCreateDispute } from "../api/create-dispute";
import { createDisputeSchema, CreateDisputeInput } from "../schemas";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const onSubmit = (data: CreateDisputeInput) => {
    // Inject mock evidence URL for Phase 2 implementation per requirements
    const payload = {
      ...data,
      evidenceUrls: ["https://example.com/mock-evidence.pdf"],
    };
    
    createDispute(payload, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Raise a Dispute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
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
              <span className="text-xs text-red-500">{errors.reason.message}</span>
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
              <span className="text-xs text-red-500">{errors.amountClaimed.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Provide a detailed description of the issue..."
              rows={5}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description.message}</span>
            )}
          </div>
          
          <div className="p-3 bg-muted rounded-md text-xs text-muted-foreground">
            Note: Evidence file uploads will be available in the next phase. A placeholder link will be attached for now.
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
