"use client";

import { useState } from "react";
import { proxyFetch } from "@/proxy";

interface SignedParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

interface UploadResult {
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  original_filename: string;
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get signed params from backend
      const params = await proxyFetch<SignedParams>("/upload/signed-params", {
        method: "POST",
      });

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", params.apiKey);
      formData.append("timestamp", params.timestamp.toString());
      formData.append("signature", params.signature);
      formData.append("folder", params.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${params.cloudName}/auto/upload`;
      
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const result = (await response.json()) as UploadResult;
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}
