"use client";

import { Job } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { useUser } from "@/features/auth";

interface NextRequiredActionProps {
  job: any;
}

export function NextRequiredAction({ job }: NextRequiredActionProps) {
  const { data: user } = useUser();
  
  if (!user) return null;

  const role = user.role;

  // Admin Actions
  if (role === "ADMIN") {
    if (job.status === "UNDER_REVIEW") {
      return (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <span>This job has been flagged for review. Please inspect the job details and take moderation action.</span>
            <Button variant="destructive" size="sm">Moderate Job <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  // Client Actions
  if (role === "CLIENT") {
    if (job.status === "DRAFT") {
      return (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Draft Job</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <span>This job is currently a draft and is not visible in the marketplace.</span>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700">Review & Publish <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (job.status === "OPEN" && job.proposalsCount > 0) {
      return (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Proposals Received</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <span>You have {job.proposalsCount} new proposals to review.</span>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">Review Proposals <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </AlertDescription>
        </Alert>
      );
    }
  }

  // Artisan Actions
  if (role === "ARTISAN") {
    return null;
  }

  return null;
}
