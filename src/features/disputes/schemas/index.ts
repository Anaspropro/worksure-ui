import { z } from "zod";

export const createDisputeSchema = z.object({
  contractId: z.string().uuid(),
  reason: z.string().min(1, "Please select a reason"),
  description: z.string().min(20, "Please provide a detailed description (min 20 characters)").max(2000),
  evidenceUrls: z.array(z.string().url()).optional(),
  amountClaimed: z.number().min(0).optional(),
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
