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

// Role-specific Workspaces
export { ClientContractsWorkspace } from "./client/components/ClientContractsWorkspace";
export { ClientContractDetail } from "./client/components/ClientContractDetail";
export { ArtisanContractsWorkspace } from "./artisan/components/ArtisanContractsWorkspace";
export { ArtisanContractDetail } from "./artisan/components/ArtisanContractDetail";

// Hooks & Service helpers
export * from "./hooks/useContracts";

// Deliverables Subdomain exports
export { DeliverableCard } from "./deliverables/components/DeliverableCard";
export { DeliverableList } from "./deliverables/components/DeliverableList";
export { DeliverableUploadForm } from "./deliverables/components/DeliverableUploadForm";
export { RevisionCard } from "./deliverables/components/RevisionCard";
