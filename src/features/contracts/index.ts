// Shared Domain components
export { ContractHeader } from "./components/ContractHeader";
export { StatusBadge as ContractStatusBadge } from "./components/status-badge";
export { ContractTimeline } from "./components/ContractTimeline";
export { ContractProgress } from "./components/ContractProgress";
export { NextRequiredAction } from "./components/NextRequiredAction";
export { EscrowSummary } from "./components/EscrowSummary";
export { ParticipantCard } from "./components/ParticipantCard";
export { ActivityFeed } from "./components/ActivityFeed";
export { ContractChatPanel } from "./components/ContractChatPanel";

import dynamic from "next/dynamic";
import React from "react";

const WorkspaceSkeleton = () =>
  React.createElement(
    "div",
    { className: "p-6 space-y-4 animate-pulse" },
    React.createElement("div", { className: "h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" }),
    React.createElement("div", { className: "h-48 w-full bg-slate-200 dark:bg-slate-700 rounded" }),
  );

// Role-specific Workspaces
export const ClientContractsWorkspace = dynamic(
  () => import("./client/components/ClientContractsWorkspace").then((m) => m.ClientContractsWorkspace),
  { loading: WorkspaceSkeleton },
);
export const ClientContractDetail = dynamic(
  () => import("./client/components/ClientContractDetail").then((m) => m.ClientContractDetail),
  { loading: WorkspaceSkeleton },
);
export const ArtisanContractsWorkspace = dynamic(
  () => import("./artisan/components/ArtisanContractsWorkspace").then((m) => m.ArtisanContractsWorkspace),
  { loading: WorkspaceSkeleton },
);
export const ArtisanContractDetail = dynamic(
  () => import("./artisan/components/ArtisanContractDetail").then((m) => m.ArtisanContractDetail),
  { loading: WorkspaceSkeleton },
);

// Hooks & Service helpers
export * from "./hooks/useContracts";

// Deliverables Subdomain exports
export { DeliverableCard } from "./deliverables/components/DeliverableCard";
export { DeliverableList } from "./deliverables/components/DeliverableList";
export { DeliverableUploadForm } from "./deliverables/components/DeliverableUploadForm";
export { RevisionCard } from "./deliverables/components/RevisionCard";
