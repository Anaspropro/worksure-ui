import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  parentId: z.string().uuid().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isPopular: z.boolean().optional(),
});

export const skillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  categoryId: z.string().uuid(),
  isTrending: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});
