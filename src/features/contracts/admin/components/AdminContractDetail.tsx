"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Wallet, MessageSquare, ShieldAlert, Zap, Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

import { ContractHeader } from "../../components/ContractHeader";
import { NextRequiredAction } from "../../components/NextRequiredAction";
import { ContractProgress } from "../../components/ContractProgress";
import { ContractTimeline } from "../../components/ContractTimeline";
import { EscrowSummary } from "../../components/EscrowSummary";
import { ParticipantCard } from "../../components/ParticipantCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { AdminDisputePanel } from "./AdminDisputePanel";
import { AdminOverrideActions } from "./AdminOverrideActions";

import { useContract } from "../../hooks/useContracts";

export function AdminContractDetail({
  contractId,
}: {
  contractId: string;
}) {
  const contractQuery = useContract(contractId);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "deliverables" | "escrow" | "disputes" | "overrides" | "activity">("overview");

  const contract = contractQuery.data;

  if (contractQuery.isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-24 bg-muted rounded-2xl" />
        <div className="h-10 bg-muted rounded-lg w-1/3" />
        <div className="h-48 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-foreground">Contract not found</h3>
        <Button asChild size="sm" className="mt-4">
          <Link href="/admin/contracts">Back to contracts</Link>
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText className="size-4 shrink-0" /> },
    { id: "timeline", label: "Lifecycle Timeline", icon: <Clock className="size-4 shrink-0" /> },
    { id: "escrow", label: "Financial Escrow", icon: <Wallet className="size-4 shrink-0" /> },
    { id: "disputes", label: "Dispute Center", icon: <ShieldAlert className="size-4 shrink-0" /> },
    { id: "overrides", label: "System Overrides", icon: <Zap className="size-4 shrink-0" /> },
    { id: "activity", label: "Full Audit Log", icon: <ActivityIcon className="size-4 shrink-0" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="h-9">
          <Link href="/admin/contracts">
            <ArrowLeft className="size-4 mr-2" />
            Back to operations console
          </Link>
        </Button>
      </div>

      {/* Contract summary and lifecycle visualizer */}
      <ContractHeader contract={contract} role="ADMIN" />

      {/* Next required operational step */}
      <NextRequiredAction
        contract={contract}
        role="ADMIN"
        onAction={() => setActiveTab("disputes")}
      />

      <ContractProgress contract={contract} />

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto gap-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="grid gap-6">
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">System Scope Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {contract.job?.description ?? "No description available."}
                  </p>
                </CardContent>
              </Card>

              <ParticipantCard contract={contract} role="ADMIN" />
            </div>

            <div className="space-y-6">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Security Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <p>Client confirmed: {contract.clientConfirmedCompletion ? "Yes" : "No"}</p>
                  <p>Artisan confirmed: {contract.artisanConfirmedCompletion ? "Yes" : "No"}</p>
                  <p>Escrow State: {contract.escrowReleased ? "Released / Paid" : "Held / Locked"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Operational Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractTimeline contractId={contract.id} />
            </CardContent>
          </Card>
        )}

        {activeTab === "escrow" && (
          <EscrowSummary contract={contract} />
        )}

        {activeTab === "disputes" && (
          <AdminDisputePanel contract={contract} />
        )}

        {activeTab === "overrides" && (
          <AdminOverrideActions contract={contract} onRefetch={() => void contractQuery.refetch()} />
        )}

        {activeTab === "activity" && (
          <ActivityFeed contractId={contract.id} />
        )}
      </div>
    </div>
  );
}
export default AdminContractDetail;
