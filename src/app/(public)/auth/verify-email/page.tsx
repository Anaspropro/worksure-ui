import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyEmailWorkspace from "@/components/features/auth/VerifyEmailWorkspace";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="size-8 text-muted-foreground animate-spin" />
      </div>
    }>
      <VerifyEmailWorkspace />
    </Suspense>
  );
}

