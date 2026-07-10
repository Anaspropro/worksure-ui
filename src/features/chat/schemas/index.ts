import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1, "Message cannot be empty").max(4000, "Message is too long"),
  tempId: z.string().uuid(), // For optimistic UI tracking
});

export const updateMessageSchema = z.object({
  messageId: z.string().uuid(),
  content: z.string().min(1, "Message cannot be empty").max(4000, "Message is too long"),
});

export const attachFileSchema = z.object({
  messageId: z.string().uuid(),
  fileData: z.any(), // Typically handled via FormData on the frontend
});
