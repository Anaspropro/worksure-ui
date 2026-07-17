import { z } from "zod";

export const createReviewSchema = z.object({
  contractId: z.string().uuid(),
  targetId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Please provide a more detailed comment").max(2000),
  categories: z.array(z.string()).optional(),
  workQuality: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  timeliness: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  evidence: z.array(z.string().url()).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
