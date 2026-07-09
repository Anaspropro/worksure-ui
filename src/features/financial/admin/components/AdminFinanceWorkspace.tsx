"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutRequestsTable } from "./PayoutRequestsTable";
import { ReconciliationPanel } from "./ReconciliationPanel";
import { ShieldAlert, ArrowUpFromLine, FileWarning } from "lucide-react";

export function AdminFinanceWorkspace() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Operations</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Manage payouts, review escrow health, and trigger reconciliations.
        </p>
      </div>

      <Tabs defaultValue="payouts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl h-12 bg-muted/50 p-1 mb-8">
          <TabsTrigger value="payouts" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <ArrowUpFromLine className="size-4" />
            Payouts
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <ShieldAlert className="size-4" />
            Reconciliation
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center gap-2 data-[state=active]:shadow-sm" disabled>
            <FileWarning className="size-4" />
            Disputes (Soon)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payouts" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <PayoutRequestsTable />
        </TabsContent>
        
        <TabsContent value="reconciliation" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReconciliationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
