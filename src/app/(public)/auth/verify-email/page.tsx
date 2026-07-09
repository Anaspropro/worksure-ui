import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerifyEmailWorkspace } from "@/features/auth";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <Loader2 className="size-8 text-muted-foreground animate-spin" />
      </div>
    }>
      <VerifyEmailWorkspace />
    </Suspense>
  );
}

