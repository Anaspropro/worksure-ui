"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/chat/FileUploader";

export default function MessageInput({
  draft,
  file,
  disabled,
  pending,
  onDraftChange,
  onFileChange,
  onClearFile,
  onSend,
}: {
  draft: string;
  file: File | null;
  disabled?: boolean;
  pending?: boolean;
  onDraftChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onClearFile: () => void;
  onSend: () => Promise<void> | void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border/70 p-3">
      <Textarea
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        placeholder="Write a message about progress, requirements, or delivery..."
        className="min-h-28 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <FileUploader file={file} onFileChange={onFileChange} onClear={onClearFile} />
        <Button type="button" onClick={onSend} disabled={disabled || pending}>
          <Send className="size-4" />
          Send message
        </Button>
      </div>
    </div>
  );
}
