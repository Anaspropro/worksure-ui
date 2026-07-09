"use client";

import type { Deliverable } from "../types";
import { formatDate } from "@/shared/lib/formatters";
import { FileIcon, ImageIcon, Video, Music, Download, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function DeliverableCard({
  deliverable,
}: {
  deliverable: Deliverable;
}) {
  const file = deliverable.files[0];
  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="size-6 text-primary shrink-0" />;
    if (isVideo) return <Video className="size-6 text-info shrink-0" />;
    if (isAudio) return <Music className="size-6 text-warning shrink-0" />;
    return <FileIcon className="size-6 text-muted-foreground shrink-0" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm group hover:border-primary/30 transition-all">
      <div className="size-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
        {getFileIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {file.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground mt-1">
          <span>{formatSize(file.size)}</span>
          <span>•</span>
          <span>Uploaded {formatDate(file.uploadedAt)}</span>
        </div>
        {deliverable.description && (
          <p className="text-xs text-muted-foreground mt-2 italic bg-muted/20 p-2 rounded border border-border/40">
            "{deliverable.description}"
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button asChild size="icon" variant="ghost" className="size-8">
          <a href={file.url} target="_blank" rel="noopener noreferrer" title="View File">
            <Eye className="size-4 text-muted-foreground hover:text-foreground" />
          </a>
        </Button>
        <Button asChild size="icon" variant="ghost" className="size-8">
          <a href={file.url} download={file.name} title="Download File">
            <Download className="size-4 text-muted-foreground hover:text-foreground" />
          </a>
        </Button>
      </div>
    </div>
  );
}
