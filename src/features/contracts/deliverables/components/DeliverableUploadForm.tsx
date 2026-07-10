"use client";

import React, { useState, useRef } from "react";
import { useSubmitDeliverable } from "../hooks/useDeliverables";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { UploadCloud, FileIcon, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function DeliverableUploadForm({
  contractId,
  conversationId,
}: {
  contractId: string;
  conversationId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = useSubmitDeliverable(conversationId);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !description.trim()) {
      toast.error("Please select a file and enter a description.");
      return;
    }

    const toastId = toast.loading("Uploading and submitting deliverable...");

    submitMutation.mutate(
      {
        contractId,
        content: description,
        file,
      },
      {
        onSuccess: () => {
          toast.success("Deliverable submitted successfully!", { id: toastId });
          setFile(null);
          setDescription("");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to submit deliverable.", { id: toastId });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-border hover:border-primary/50 bg-muted/10 hover:bg-muted/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <FileIcon className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground truncate max-w-xs">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 size-6 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <UploadCloud className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Drag & drop file here, or click to browse
              </p>
              <p className="text-[10px] text-muted-foreground">
                Supports PDFs, ZIPs, images, or media up to 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Submission Note / Comments
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what is included in this deliverable..."
          className="bg-card min-h-[80px]"
        />
      </div>

      <Button
        type="submit"
        disabled={!file || !description.trim() || submitMutation.status === "pending"}
        className="w-full shadow-sm"
      >
        Submit Deliverable Files
      </Button>
    </form>
  );
}
export default DeliverableUploadForm;
