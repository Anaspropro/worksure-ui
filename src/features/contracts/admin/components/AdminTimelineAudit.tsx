"use client";

import { ContractTimeline } from "../../components/ContractTimeline";

export function AdminTimelineAudit({
  contractId,
}: {
  contractId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-muted/30 border border-border/80 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Below is the immutable system audit trail. All actor roles, timestamps, payment validations, and dispute event signatures are logged chronologically.
        </p>
      </div>
      <ContractTimeline contractId={contractId} />
    </div>
  );
}
export default AdminTimelineAudit;
