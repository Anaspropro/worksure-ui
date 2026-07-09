"use client";

import type { ChatMessage, Contract } from "@/types";
import type { Deliverable, DeliverableFile } from "../types";

export function deriveDeliverablesFromMessages(
  contract: Contract,
  messages: ChatMessage[]
): Deliverable[] {
  // Filter messages that contain file attachments
  const fileMessages = messages.filter(
    (msg) => msg.type !== "TEXT" && msg.fileUrl
  );

  return fileMessages.map((msg, index) => {
    const file: DeliverableFile = {
      url: msg.fileUrl!,
      name: msg.fileName ?? `attachment-${index + 1}`,
      type: msg.fileType ?? "application/octet-stream",
      size: msg.fileSize ?? 0,
      uploadedAt: msg.createdAt,
    };

    const isArtisan = msg.senderId === contract.artisanId;

    return {
      id: msg.id,
      contractId: contract.id,
      submittedBy: isArtisan ? "ARTISAN" : "CLIENT",
      submittedAt: msg.createdAt,
      status: "SUBMITTED", // Default derived state
      files: [file],
      description: msg.content ?? undefined,
    };
  });
}
