import { z } from "zod";

export const jobStatusSchema = z.enum([
  "DRAFT",
  "OPEN",
  "UNDER_REVIEW",
  "AWARDED",
  "CLOSED",
  "CANCELLED",
]);

export const createJobSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long").max(100),
  description: z.string().min(50, "Description must be at least 50 characters long"),
  categoryId: z.string().uuid("Please select a valid category"),
  skillIds: z.array(z.string().uuid()).min(1, "Select at least one skill").max(10, "Maximum of 10 skills allowed"),
  budget: z.number().min(5, "Minimum budget is $5"),
  budgetType: z.enum(["FIXED", "HOURLY"]),
  isRemote: z.boolean(),
  location: z.string().optional(),
  expectedDuration: z.string().optional(),
});

export type CreateJobPayload = z.infer<typeof createJobSchema>;
