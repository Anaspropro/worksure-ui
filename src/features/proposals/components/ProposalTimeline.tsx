"use client";

import { Circle, User, Building, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalTimelineProps {
  proposalId: string;
}

export function ProposalTimeline({ proposalId }: ProposalTimelineProps) {
  // TODO: Use real timeline hook once backend supports proposal timeline events
  return <div className="text-sm text-muted-foreground text-center py-4">No events recorded.</div>;
}
