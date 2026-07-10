import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreateReview } from "../api/create-review";
import { createReviewSchema, CreateReviewInput } from "../schemas";

interface ReviewFormProps {
  contractId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReviewForm({ contractId, open, onOpenChange, onSuccess }: ReviewFormProps) {
  const { mutate: createReview, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      contractId,
      rating: 5,
      workQuality: 5,
      communication: 5,
      timeliness: 5,
      professionalism: 5,
      comment: "",
    },
  });

  const onSubmit = (data: CreateReviewInput) => {
    createReview(data, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
        onSuccess?.();
      },
    });
  };

  const StarRating = ({ name, label }: { name: keyof CreateReviewInput; label: string }) => {
    const value = watch(name) as number;
    return (
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setValue(name as any, star)}
              className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
        {errors[name] && <span className="text-xs text-red-500">{errors[name]?.message as string}</span>}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <StarRating name="rating" label="Overall Rating" />
          
          <div className="grid grid-cols-2 gap-4">
            <StarRating name="workQuality" label="Work Quality" />
            <StarRating name="communication" label="Communication" />
            <StarRating name="timeliness" label="Timeliness" />
            <StarRating name="professionalism" label="Professionalism" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments</label>
            <Textarea
              {...register("comment")}
              placeholder="Share your experience working with this artisan..."
              rows={4}
            />
            {errors.comment && (
              <span className="text-xs text-red-500">{errors.comment.message}</span>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
