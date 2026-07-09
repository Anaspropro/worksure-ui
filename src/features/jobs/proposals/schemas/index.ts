import { z } from "zod";

export const submitProposalSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(2000),
  bidAmount: z.number().min(5, "Minimum bid is $5"),
  estimatedDuration: z.string().min(1, "Please provide an estimated duration"),
  attachmentIds: z.array(z.string()).optional(),
});

export type SubmitProposalPayload = z.infer<typeof submitProposalSchema>;
