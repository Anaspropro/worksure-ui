"use client";

import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileUploader({
  file,
  onFileChange,
  onClear,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-3">
      {file ? (
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/40 px-3 py-2 text-sm">
          <span className="truncate">Attachment: {file.name}</span>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Remove
          </Button>
        </div>
      ) : null}

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <Paperclip className="size-4" />
        Add file
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*,audio/*,application/pdf"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
