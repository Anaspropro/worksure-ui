"use client";

import Image from "next/image";
import { formatDate } from "@/lib/formatters";
import type { ChatMessage } from "@/types";

function AttachmentPreview({ message }: { message: ChatMessage }) {
  if (!message.fileUrl) {
    return null;
  }

  if (message.type === "IMAGE") {
    return (
      <div className="overflow-hidden rounded-xl">
        <Image
          src={message.fileUrl}
          alt={message.fileName || "Chat image"}
          width={720}
          height={480}
          className="h-auto max-h-72 w-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  if (message.type === "VIDEO") {
    return <video controls src={message.fileUrl} className="max-h-72 rounded-xl" />;
  }

  if (message.type === "AUDIO") {
    return <audio controls src={message.fileUrl} className="w-full" />;
  }

  return (
    <a
      href={message.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-full border border-border/70 px-3 py-1 text-sm font-medium text-current/90 hover:bg-black/5"
    >
      {message.fileName || "Open attachment"}
    </a>
  );
}

export default function MessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isOwn ? "bg-emerald-600 text-white" : "bg-white text-foreground"
        }`}
      >
        {message.content ? <p className="whitespace-pre-wrap leading-6">{message.content}</p> : null}
        <AttachmentPreview message={message} />
        <p className={`text-[11px] ${isOwn ? "text-emerald-50/90" : "text-muted-foreground"}`}>
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
