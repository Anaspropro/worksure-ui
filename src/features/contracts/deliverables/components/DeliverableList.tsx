"use client";

import { useDeliverables } from "@/features/contracts/deliverables/hooks/useDeliverables";
import { DeliverableCard } from "@/features/contracts/deliverables/components/DeliverableCard";
import { DeliverableUploadForm } from "@/features/contracts/deliverables/components/DeliverableUploadForm"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { FileText } from "lucide-react";

export function DeliverableList({
  contractId,
  role,
  conversationId,
}: {
  contractId: string;
  role: "CLIENT" | "ARTISAN" | "ADMIN";
  conversationId?: string;
}) {
  const { data: deliverables = [], isLoading } = useDeliverables(contractId);
  const isArtisan = role === "ARTISAN";

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Contract Deliverables</CardTitle>
              <CardDescription className="text-xs">
                All submitted project files, layouts, assets, and document versions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : deliverables.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10 rounded-xl border border-dashed border-border/80">
              <p className="text-sm font-medium text-foreground">No deliverables submitted yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {isArtisan
                  ? "Upload your final work files below to request client review."
                  : "Submitted project files from the artisan will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliverables.map((del) => (
                <DeliverableCard key={del.id} deliverable={del} />
              ))}
            </div>
          )}

          {isArtisan && conversationId && (
            <div className="border-t border-border/60 pt-4 mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Submit New Work Deliverable
              </h4>
              <DeliverableUploadForm
                contractId={contractId}
                conversationId={conversationId}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default DeliverableList;
