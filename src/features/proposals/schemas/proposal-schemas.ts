import { z } from 'zod';

const MAX_IMAGE_SIZE = 100 * 1024; // 100kB
const MAX_DOC_SIZE = 50 * 1024;    // 50kB

export const proposalAttachmentSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
}).refine((file) => {
  if (file.fileType.startsWith('image/')) {
    return file.fileSize <= MAX_IMAGE_SIZE;
  }
  return file.fileSize <= MAX_DOC_SIZE;
}, {
  message: "File exceeds the allowed size limits (Images: 100kB, Docs: 50kB)",
  path: ['fileSize'],
});

export const createProposalSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  amount: z.number().positive(),
  message: z.string().min(10, 'Cover letter must be at least 10 characters.'),
  estimatedDuration: z.string().optional(),
  attachments: z.array(proposalAttachmentSchema).optional(),
  isDraft: z.boolean().optional(),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
